const express = require("express");
const router = express.Router();

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const grammarRouter = require("./grammarRouter");
const paymentRouter = require("./paymentRouter");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/grammar", grammarRouter);
router.use("/payment", paymentRouter);

module.exports = router;
