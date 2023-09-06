const jwt = require("jsonwebtoken");
const { asyncErrorHandler, throwCustomError } = require("../utils/error");

const validateToken = asyncErrorHandler(async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    throwCustomError("Need access token", 400);
  }

  const token = accessToken.split(" ")[1];
  const decoded = await jwt.verify(token, process.env.JWT_SECRETKEY);

  if (!decoded) {
    throwCustomError("User does not exist", 400);
  }

  req.userId = decoded.userId;
  next();
});

module.exports = {
  validateToken,
};
