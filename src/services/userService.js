const userDao = require("../models/userDao");

const getGrade = async (userId) => {
  return await userDao.getUserInfo(userId, "userId");
};

module.exports = { getGrade };
