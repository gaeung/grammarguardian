const { asyncErrorHandler } = require("../utils/error");
const paymentService = require("../services/paymentService");
const userService = require("../services/userService");

const readyPayment = asyncErrorHandler(async (req, res) => {
  const planId = req.query.planId;

  const result = await paymentService.readyPayment(planId);

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

  // 로거 추가하기
  return res
    .status(200)
    .json({ message: "Payment and subscription have been completed." });
});

module.exports = { readyPayment, processPayment };
