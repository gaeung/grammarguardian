const { asyncErrorHandler } = require("../utils/error");
const paymentService = require("../services/paymentService");
const logger = require("../utils/logger");

const readyPayment = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const planId = req.query.planId;

  const result = await paymentService.readyPayment(planId);

  logger.info(
    `User with ID ${userId} is attempting to ready payment for plan ${planId}`
  );

  return res
    .status(200)
    .json({ tid: result.tid, redirect_url: result.redirect_url });
});

const processPayment = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { planId, tid, pgToken } = req.query;

  const result = await paymentService.processPayment(
    userId,
    planId,
    tid,
    pgToken
  );

  if (result.success === false) {
    return res.status(500).json({ message: "Payment failed" });
  }

  logger.info(
    `User with ID ${userId} is processing payment for plan ${planId} with subcriptionId ${result.subscriptionId}}`
  );

  return res.status(200).json({
    subscriptionId: result.subscriptionId,
    message: "Payment and subscription have been completed.",
  });
});

module.exports = { readyPayment, processPayment };
