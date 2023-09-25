const { asyncErrorHandler } = require("../utils/error");
const subscriptionService = require("../services/subscriptionService");
const logger = require("../utils/logger");

const getSubscriptionHistory = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;

  const history = await subscriptionService.getSubscriptionHistory(userId);

  return res.status(200).json({ history });
});

const getSubscriptionStatus = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;

  const status = await subscriptionService.getSubscriptionStatus(userId);

  return res.status(200).json({ status });
});

const inactivateSubscription = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const subscriptionId = req.params.subscriptionId;

  if (!subscriptionId) {
    throwCustomError("Missing subscription ID", 400);
  }

  await subscriptionService.inactivateSubscription(userId, subscriptionId);

  logger.info("Inactivate ubscription successful", {
    userId: userId,
    subscriptionId: subscriptionId,
  });

  return res
    .status(201)
    .json({ message: "Subscription inactivated successfully" });
});

module.exports = {
  inactivateSubscription,
  getSubscriptionStatus,
  getSubscriptionHistory,
};
