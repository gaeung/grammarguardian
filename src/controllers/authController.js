const logger = require("../utils/logger");
const { asyncErrorHandler, throwCustomError } = require("../utils/error");
const authService = require("../services/authService");

const signup = asyncErrorHandler(async (req, res) => {
  const { nickname, email, password } = req.body;

  if (!email || !password) {
    throwCustomError("Missing email or password", 400);
  }

  await authService.signup(nickname, email, password);

  logger.info("Signup successful", { email: email });

  return res.status(201).json({ message: "User created" });
});

const basicLogin = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throwCustomError("Missing email or password", 400);
  }

  const jwtToken = await authService.basicLogin(email, password);

  logger.info("Basic login successful", { email: email });

  return res.status(200).json({ accessToken: jwtToken });
});

const kakaoLogin = asyncErrorHandler(async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) throwCustomError("Missing authorization code", 400);

  const accessToken = await authService.kakaoLogin(authCode);

  return res.status(200).json({ accessToken });
});

module.exports = {
  signup,
  basicLogin,
  kakaoLogin,
};
