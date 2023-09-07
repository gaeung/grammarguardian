const express = require("express");
const router = express.Router();

const authRouter = require("./authRouter");
const grammarRouter = require("./grammarRouter");

router.use("/auth", authRouter);
router.use("/grammar", grammarRouter);

module.exports = router;
