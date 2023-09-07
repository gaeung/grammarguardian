const { asyncErrorHandler } = require("../utils/error");
const grammarService = require("../services/grammarService");

const getCheck = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { korText, engText } = req.body;

  const feedback = await grammarService.getCheck(userId, korText, engText);

  return res.status(200).json({ feedback: feedback });
});

module.exports = {
  getCheck,
};
