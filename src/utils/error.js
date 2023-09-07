const logger = require("../utils/logger");

const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  };
};

const throwCustomError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.detail = message;

  throw err;
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { detail: err.detail });
  return res.status(err.statusCode || 500).json({ message: err.message });
};

module.exports = {
  errorHandler,
  throwCustomError,
  asyncErrorHandler,
};
