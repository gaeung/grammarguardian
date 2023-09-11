const { asyncErrorHandler } = require("../utils/error");
const userService = require("../services/userService");

const getGrade = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const [gradeInfo] = await userService.getGrade(userId);

  return res.status(200).json({ grade: gradeInfo });
});

module.exports = { getGrade };
