const express = require("express");
const router = express.Router();

const grammarController = require("../controllers/grammarController");
const { validateToken } = require("../utils/auth");

router.post("/check", validateToken, grammarController.getCheck);

module.exports = router;
