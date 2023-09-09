const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { validateToken } = require("../utils/auth");

router.get("/grade", validateToken, userController.getGrade);

module.exports = router;
