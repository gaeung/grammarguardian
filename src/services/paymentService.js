const axios = require("axios");
const moment = require("moment-timezone");

const paymentDao = require("../models/paymentDao");
const subscriptionDao = require("../models/subscriptionDao");
const { throwCustomError } = require("../utils/error");
const logger = require("../utils/logger");

function getStartAndEndDate(date) {
  const utcTime = moment.tz(date, "UTC");
  const kstTime = utcTime.tz("Asia/Seoul");
  const startDate = kstTime.format("YYYY-MM-DD HH:mm:ss");
  const endDate = kstTime.add(30, "days").format("YYYY-MM-DD HH:mm:ss");

  return { startDate, endDate };
}

const PlanName = Object.freeze({
  2: "유료 회원 정기 결제",
  3: "프리미엄 회원 정기 결제",
});

const SubscriptionPrice = Object.freeze({
  2: 30000,
  3: 50000,
});

const readyPayment = async (planId) => {
  try {
    const kakaoPaymentReady = await axios.post(
      "https://kapi.kakao.com/v1/payment/ready",
      {},
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          cid: process.env.KAKAO_CID,
          partner_order_id: process.env.KAKAO_PARTNER_ORDER_ID,
          partner_user_id: process.env.KAKAO_PARTNER_USER_ID,
          item_name: PlanName[planId],
          quantity: 1,
          total_amount: SubscriptionPrice[planId],
          vat_amount: Math.round((SubscriptionPrice[planId] * 10) / 110),
          tax_free_amount: 0,
          approval_url: process.env.KAKAO_APPROVAL_URL,
          fail_url: process.env.KAKAO_FAIL_URL,
          cancel_url: process.env.KAKAO_CANCEL_URL,
        },
      }
    );

    const tid = kakaoPaymentReady.data.tid;
    const redirect_url = kakaoPaymentReady.data.next_redirect_pc_url;

    return { tid, redirect_url };
  } catch (err) {
    throwCustomError("Error occurred while attempting to ready kakaopay", 400);
  }
};

const processPayment = async (userId, planId, tid, pgToken) => {
  try {
    const kakaoPayProcess = await axios.post(
      "https://kapi.kakao.com/v1/payment/approve",
      {},
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          cid: process.env.KAKAO_CID,
          partner_order_id: process.env.KAKAO_PARTNER_ORDER_ID,
          partner_user_id: process.env.KAKAO_PARTNER_USER_ID,
          tid: tid,
          pg_token: pgToken,
        },
      }
    );

    const sid = kakaoPayProcess.data.sid;
    const paymentMethod = kakaoPayProcess.data.payment_method_type;
    const amount = kakaoPayProcess.data.amount.total;

    if (kakaoPayProcess.status === 200) {
      const paymentStatus = "Completed";
      const subscriptionStatus = "Active";
      const { startDate, endDate } = getStartAndEndDate(
        kakaoPayProcess.data.approved_at
      );

      try {
        await paymentDao.createPayment(
          userId,
          tid,
          sid,
          planId,
          paymentMethod,
          paymentStatus,
          amount
        );

        await subscriptionDao.createSubscription(
          userId,
          planId,
          tid,
          sid,
          subscriptionStatus,
          startDate,
          endDate
        );

        return { success: true };
      } catch (err) {
        logger.error(
          `Error processing payment for user with ID ${userId}. Error: ${err.message}`
        );
        throwCustomError(
          "An error occurred during the first-time payment and subscription transaction",
          500
        );
      }
    }
  } catch (err) {
    logger.error(
      `Error processing payment for user with ID ${userId}. Error: ${err.message}`
    );

    throwCustomError(
      "Error occurred while attempting to process kakaopay",
      400
    );
  }
};

module.exports = { readyPayment, processPayment };
