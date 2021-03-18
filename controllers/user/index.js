// 모델 불러오기
const userModel = require("../../models").user;
const jwt = require("jsonwebtoken");
const {
  isAuthorized,
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
  checkRefeshToken,
  resendAccessToken,
} = require("./tokenFunctions");
require("dotenv").config();
module.exports = {
  // 회원가입
  signup: async (req, res) => {
    const { user_password, user_email, user_nick } = req.body;

    if (!user_password || !user_email || !user_nick) {
      return res.status(422).send("Unprocessable Entity");
    }

    const [find, created] = await userModel.findOrCreate({
      where: {
        user_email: user_email,
      },
      defaults: {
        user_use_currency: "$",
        user_use_language: "kor",
        user_type: "user",
        user_password: user_password,
        user_nick: user_nick,
        wallet_now_deposit: 0,
        wallet_now_coin: 0,
      },
    });
    if (created) {
      res.json({
        msg: `created ok`,
      });
      return;
    }
    res.json({
      msg: `find ok`,
    });
    return;
  },

  // 로그인
  accessTokenRequest: async (req, res) => {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      return res.json({ msg: "invalid access token" });
    }
    const { user_email } = accessTokenData;
    const result = await userModel.findOne({ where: { user_email } });
    if (result === null) {
      res.json({ msg: "Not found" });
      return;
    }
    res.json({ msg: "ok" });
    return;
  },

  refreshTokenRequest: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.json({ msg: "refresh token not provided" });
      return;
    }
    const refreshTokenData = checkRefeshToken(refreshToken);
    if (!refreshTokenData) {
      res.json({ msg: "invalid refresh token, please log in again" });
      return;
    }
    const { user_email } = refreshTokenData;
    const result = await userModel.findOne({ where: { user_email } });
    if (!result) {
      res.json({ msg: "refresh token has been tempered" });
      return;
    }
    delete result.dataValues.user_password;
    const newAccessToken = generateAccessToken(result.dataValues);
    resendAccessToken(res, newAccessToken, result.dataValues);
  },

  signin: async (req, res) => {
    const { user_email, user_password } = req.body;
    let result = await userModel.findOne({
      where: {
        user_email,
        user_password,
      },
    });
    if (!result) {
      res.json({ msg: "not authorized" });
      return;
    }
    delete result.dataValues.user_password;
    const accessToken = generateAccessToken(result.dataValues);
    const refreshToken = generateRefreshToken(result.dataValues);
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);
  },

  // 로그아웃
  signout: async (req, res) => {},
};
