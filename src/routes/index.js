const express = require("express");
const router = express.Router();

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const grammarRouter = require("./grammarRouter");
const paymentRouter = require("./paymentRouter");
const subscriptionRouter = require("./subscriptionRouter");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/grammar", grammarRouter);
router.use("/payment", paymentRouter);
router.use("/subscription", subscriptionRouter);

module.exports = router;
