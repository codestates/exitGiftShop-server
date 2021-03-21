// .env
require("dotenv").config();

// cryto
const CryptoJS = require("crypto-js");

// models
const userModel = require("../../models").user;

// jwt & function
const {
  isAuthorized,
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
  checkRefeshToken,
  resendAccessToken,
} = require("./tokenFunctions");

// google oauth
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "724060049648-nnacpoao7gftdukk1gurp600rfgme79k.apps.googleusercontent.com"
);

module.exports = {
  signup: async (req, res) => {
    const { user_password, user_email } = req.body;

    if (!user_password || !user_email) {
      return res.status(422).json({ msg: "need more information" });
    }
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(user_password),
      process.env.SALT
    ).toString();
    const [find, created] = await userModel.findOrCreate({
      where: {
        user_email: user_email,
      },
      defaults: {
        user_use_currency: "$",
        user_use_language: "kor",
        user_type: "user",
        user_password: ciphertext,
        user_nick: "user",
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
    if (find) {
      res.status(409).json({
        msg: `duplicate email`,
      });
      return;
    }
    res.status(400).json({ msg: "err" });
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
    console.log(req.cookies);
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
    delete result.dataValues.id;
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
      res.status(401).json({ msg: "not authorized" });
      return;
    }
    delete result.dataValues.id;
    delete result.dataValues.user_password;
    const accessToken = generateAccessToken(result.dataValues);
    const refreshToken = generateRefreshToken(result.dataValues);
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);
  },

  //oauth 로그인
  callback: async (req, res) => {
    let token = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "724060049648-nnacpoao7gftdukk1gurp600rfgme79k.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload(); // 데이터 핸들러
    const user_email = payload["email"]; // 데이터 핸들러
    console.log(user_email);
    const [find, created] = await userModel.findOrCreate({
      where: {
        user_email: user_email,
      },
      defaults: {
        user_use_currency: "$",
        user_use_language: "kor",
        user_type: "oauth",
        user_password: "password",
        user_nick: "null",
        wallet_now_deposit: 0,
        wallet_now_coin: 0,
      },
    });
    if (find) {
      let result = await userModel.findOne({
        where: {
          user_email: user_email,
        },
      });
      if (!result) {
        res.status(401).json({ msg: "not authorized" });
        return;
      }
      console.log(result);
      delete result.dataValues.id;
      delete result.dataValues.user_password;
      const accessToken = generateAccessToken(result.dataValues);
      const refreshToken = generateRefreshToken(result.dataValues);
      sendRefreshToken(res, refreshToken);
      sendAccessToken(res, accessToken);
      return;
    }
    callback();
  },
};
