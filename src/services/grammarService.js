const userDao = require("../models/userDao");
const grammarDao = require("../models/grammarDao");
const chatGPT = require("../utils/chatGPT");

const PlanTypeId = Object.freeze({
  FREE: 1,
  PAID: 2,
  PREMIUM: 3,
});

const getCheck = async (userId, korText, engText) => {
  const [userGrade] = await userDao.getUserInfo(userId, "userId");
  const planGrade = userGrade.plan_type_id;

  let feedback;

  try {
    switch (planGrade) {
      case PlanTypeId.PREMIUM:
        feedback = await chatGPT.advancedCorrection(korText, engText);
        break;
      case PlanTypeId.PAID:
        feedback = await chatGPT.basicCorrection(korText, engText);
        break;
      default:
        feedback = await chatGPT.defaultCorrection(korText, engText);
    }
  } catch (err) {
    throwCustomError("Grammar check failed", 500);
  }

  await grammarDao.createHistory(userId, korText, engText, feedback);

  return feedback;
};

module.exports = {
  getCheck,
};
