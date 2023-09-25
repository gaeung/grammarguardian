const express = require("express");
const router = express.Router();

const subscriptionController = require("../controllers/subscriptionController");
const { validateToken } = require("../utils/auth");

router.get(
  "/history",
  validateToken,
  subscriptionController.getSubscriptionHistory
);
router.get(
  "/status",
  validateToken,
  subscriptionController.getSubscriptionStatus
);
router.post(
  "/inactivation/:subscriptionId",
  validateToken,
  subscriptionController.inactivateSubscription
);

module.exports = router;
