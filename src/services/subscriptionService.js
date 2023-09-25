const axios = require("axios");
const moment = require("moment-timezone");

const subscriptionDao = require("../models/subscriptionDao");
const { throwCustomError } = require("../utils/error");
const logger = require("../utils/logger");

function getDate(date) {
  const utcTime = moment.tz(date, "UTC");
  const kstTime = utcTime.tz("Asia/Seoul");
  const kstDateTime = kstTime.format("YYYY-MM-DD HH:mm:ss");

  return kstDateTime;
}

const getSubscriptionHistory = async (userId) => {
  const [history] = await subscriptionDao.getSubscriptionHistory(userId);

  return history;
};

const getSubscriptionStatus = async (userId) => {
  const [result] = await subscriptionDao.getSubscriptionHistory(userId);

  const sid = result.sid;

  try {
    const kakaoSubscriptionStatus = await axios.post(
      "https://kapi.kakao.com/v1/payment/manage/subscription/status",
      {},
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          cid: process.env.KAKAO_CID,
          sid: sid,
        },
      }
    );

    if (kakaoSubscriptionStatus.status !== 200) {
      throwCustomError(
        "An error occurred while fetching the Kakao subscription payment status.",
        400
      );
    }

    return kakaoSubscriptionStatus.data;
  } catch (err) {
    logger.error(
      `Error occurred while fetching the status of subscription for user with ID ${userId}. Error: ${err.message}`
    );

    throwCustomError(
      "An error occurred while attempting to fetch Kakao subscription status.",
      400
    );
  }
};

const inactivateSubscription = async (userId, subscriptionId) => {
  const [subscriptionInfo] = await subscriptionDao.getSubscriptionInfo(userId);

  const sid = subscriptionInfo.sid;

  try {
    const kakaoInactivate = await axios.post(
      "https://kapi.kakao.com/v1/payment/manage/subscription/inactive",
      {},
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          cid: process.env.KAKAO_CID,
          sid: sid,
        },
      }
    );

    const inactivatedAt = getDate(kakaoInactivate.data.inactivated_at);

    if (kakaoInactivate.data.status !== "INACTIVE") {
      throwCustomError(
        "An error occurred during the Kakao subscription inactivation.",
        400
      );
    }

    return await subscriptionDao.inactivateSubscription(
      userId,
      sid,
      subscriptionId,
      inactivatedAt
    );
  } catch (err) {
    logger.error(
      `Error processing inactivation of subsciprion for user with user ID ${userId}. Error: ${err.message}`
    );

    throwCustomError(
      "Error occurred while attempting to process kakao subscription inactivate",
      400
    );
  }
};

module.exports = {
  getSubscriptionHistory,
  getSubscriptionStatus,
  inactivateSubscription,
};
