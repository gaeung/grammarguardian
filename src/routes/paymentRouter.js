const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const { validateToken } = require("../utils/auth");

router.get("/", paymentController.readyPayment);
router.post("/", validateToken, paymentController.processPayment);

module.exports = router;
