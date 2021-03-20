// models
const userModel = require("../../models").user;

// .env
require("dotenv").config();

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
const CLIENT_ID = process.env.oauth_id;
const client = new OAuth2Client(CLIENT_ID);

// function
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
  signout: (req, res) => {
    res.clearCookie("refreshToken", { maxAge: 0 });
    res.json({ msg: "ok" });
  },

  //oauth url get
  url: (req, res) => {
    res.send(getGoogleAuthURL());
  },

  code: (req, res) => {
    console.log(req.headers.cookie);
  },

  //oauth 로그인

  helloRender: (req, res) => {
    res.render("login");
  },

  callback: (req, res) => {
    let token = req.body.token;
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload(); // 데이터 핸들러
      const userid = payload["sub"]; // 데이터 핸들러
      console.log(payload);
    }
    verify()
      .then(() => {
        res.cookie("session-token", token);
        res.send("success");
      })
      .catch(console.error);
  },

  signoutoauth: (req, res) => {
    res.clearCookie("session-token");
    res.redirect("/");
  },

  // dashboard: (req, res) => {
  //   let user = req.user;
  //   res.render("dashboard", { user });
  // },
};
