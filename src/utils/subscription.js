const cron = require("node-cron");
const axios = require("axios");
const moment = require("moment-timezone");

const paymentDao = require("../models/paymentDao");
const subscriptionDao = require("../models/subscriptionDao");
const logger = require("./logger");
const { throwCustomError } = require("../utils/error");

const PlanName = Object.freeze({
  2: "유료 회원 정기 결제",
  3: "프리미엄 회원 정기 결제",
});

const SubscriptionPrice = Object.freeze({
  2: 30000,
  3: 50000,
});

function getEndDate(date) {
  const utcTime = moment.tz(date, "UTC");
  const kstTime = utcTime.tz("Asia/Seoul");
  const endDate = kstTime.add(30, "days").format("YYYY-MM-DD HH:mm:ss");

  return endDate;
}

const retryOnError = async (func, retries = 3) => {
  let attempts = 0;
  let lastError;

  while (attempts < retries) {
    try {
      return await func();
    } catch (err) {
      lastError = err;
      attempts++;
      logger.warn(`Retry ${attempts} failed, retrying...`);
    }
  }

  logger.error(`Max retries reached: ${lastError.message}`);
  throwCustomError("Max retries reached", 400);
};

const subscription = () => {
  const task = cron.schedule("0 0 * * *", async () => {
    try {
      const check = await subscriptionDao.checkSubscription();
      logger.info(
        `Cron job started for subscription checks for ${check.length} users`
      );

      for (const obj of check) {
        const userId = obj.userId;
        const tid = obj.tid;
        const sid = obj.sid;
        const planId = obj.planId;

        const processPayment = async () => {
          try {
            const kakaoPayProcess = await axios.post(
              "https://kapi.kakao.com/v1/payment/subscription",
              {},
              {
                headers: {
                  Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
                  "Content-type":
                    "application/x-www-form-urlencoded;charset=utf-8",
                },
                params: {
                  cid: process.env.KAKAO_CID,
                  sid: sid,
                  partner_order_id: process.env.KAKAO_PARTNER_ORDER_ID,
                  partner_user_id: process.env.KAKAO_PARTNER_USER_ID,
                  item_name: PlanName[planId],
                  quantity: 1,
                  total_amount: SubscriptionPrice[planId],
                  vat_amount: Math.round(
                    (SubscriptionPrice[planId] * 10) / 110
                  ),
                  tax_free_amount: 0,
                },
              }
            );

            if (kakaoPayProcess.status !== 200) {
              throwCustomError(`Payment failed for userId: ${userId}`, 400);
            }

            if (kakaoPayProcess.status === 200) {
              const paymentMethod = kakaoPayProcess.data.payment_method_type;
              const amount = kakaoPayProcess.data.amount.total;

              const paymentStatus = "Completed";
              const endDate = getEndDate(kakaoPayProcess.data.approved_at);

              await paymentDao.createPayment(
                userId,
                tid,
                sid,
                planId,
                paymentMethod,
                paymentStatus,
                amount
              );

              await subscriptionDao.updateSubscription(
                userId,
                sid,
                planId,
                endDate
              );

              logger.info(
                `Payment completed for userId: ${userId}, amount: ${amount}`
              );
            }
          } catch (error) {
            throw error;
          }
        };

        await retryOnError(processPayment);
      }
    } catch (err) {
      logger.error(
        `Error occurred while processing subscriptions: ${err.message}`
      );
      throwCustomError(
        "Error occurred while attempting to process subscription",
        400
      );
    }
  });

  task.start();
};

module.exports = subscription;
