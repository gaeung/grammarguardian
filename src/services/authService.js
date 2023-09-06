const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const userDao = require("../models/userDao");
const { throwCustomError } = require("../utils/error");

const SocialTypeId = Object.freeze({
  LOCAL: 1,
  KAKAO: 2,
  NAVER: 3,
  GOOGLE: 4,
});

const signup = async (nickname, email, password) => {
  const pwValidation = new RegExp(
    "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})"
  );

  if (!pwValidation.test(password)) {
    throwCustomError("Password does not meet requirements", 400);
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const socialId = null;
  const socialTypeId = SocialTypeId.LOCAL;

  const createUser = await userDao.createUser(
    nickname,
    email,
    hashedPassword,
    socialId,
    socialTypeId
  );

  return createUser;
};

const basicLogin = async (email, password) => {
  const [user] = await userDao.getUserInfo(email, "email");

  if (!user) {
    throwCustomError("Invalid credentials", 401);
  }

  const compare = await bcrypt.compare(password, user.hashedPassword);

  if (!compare) {
    throwCustomError("Password does not match", 401);
  }

  const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRETKEY);

  return jwtToken;
};

const kakaoLogin = async (authCode) => {
  try {
    const getKakaoToken = await axios.get(
      "https://kauth.kakao.com/oauth/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_url: process.env.KAKAO_REDIRECT_URI,
          code: authCode,
        },
        withCredentials: true,
      }
    );
    const getKakaoUserData = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: {
          Authorization: `Bearer ${getKakaoToken.data.access_token}`,
        },
      }
    );

    const socialId = getKakaoUserData.data.id;
    const email = getKakaoUserData.data.kakao_account.email;
    const nickname = getKakaoUserData.data.properties.nickname;
    const socialTypeId = SocialTypeId.KAKAO;

    const [user] = await userDao.getUserInfo(socialId, "socialUser");

    if (!user) {
      const password = null;

      const createUser = await userDao.createUser(
        nickname,
        email,
        password,
        socialId,
        socialTypeId
      );

      const accessToken = jwt.sign(
        { userId: createUser.insertId },
        process.env.JWT_SECRETKEY,
        {
          algorithm: process.env.ALGORITHM,
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      return accessToken;
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRETKEY,
      {
        algorithm: process.env.ALGORITHM,
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return accessToken;
  } catch (err) {
    throwCustomError("Error occurred while attempting to login", 400);
  }
};

module.exports = {
  signup,
  basicLogin,
  kakaoLogin,
};
