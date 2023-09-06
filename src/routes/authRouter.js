const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/basicLogin", authController.basicLogin);
router.post("/kakaoLogin", authController.kakaoLogin);

module.exports = router;
