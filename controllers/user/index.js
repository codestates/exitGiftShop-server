// models
const userModel = require("../../models").user;
const puzzleModel = require("../../models").puzzle;
const auctionModel = require("../../models").auction;
const paddleModel = require("../../models").paddle;
const likesModel = require("../../models").likes;
const bidModel = require("../../models").bid;
const artModel = require("../../models").art;

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
      return res.status(422).json({ msg: "need more information" });
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
      res.status(401).json({ msg: "not authorized" });
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
    if (!req.cookies.refreshToken)
      res.status(400).json({ msg: "not authorized" });
    else {
      res.clearCookie("refreshToken");
      res.json({ msg: "ok" });
    }
  },

  //oauth 로그인
  callback: async (req, res) => {
    let token = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
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
      delete find.dataValues.user_password;
      const accessToken = generateAccessToken(find.dataValues);
      const refreshToken = generateRefreshToken(find.dataValues);
      sendRefreshToken(res, refreshToken);
      sendAccessToken(res, accessToken);
      return;
    }
    callback();
  },

  list: async (req, res) => {
    const list = await userModel.findAll({
      attributes: { exclude: ["id"] },
    });
    if (!list) {
      res.status(404).json({
        msg: `auction not found`,
      });
      return;
    }
    res.json(list);
    return;
  },

  search: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const user = await userModel.findOne({
      where: { uuid: uuid },
      attributes: { exclude: ["id"] },
    });
    if (!user) {
      res.status(404).json({
        msg: `user not found`,
      });
      return;
    }
    res.json(user);
    return;
  },

  searchPuzzle: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const puzzle = await puzzleModel.findAll({
      where: { puzzle_user_uuid: uuid },
      include: [
        { model: userModel, as: `puzzle_user_uu` },
        { model: auctionModel, as: `puzzle_auction_uu` },
      ],
      attributes: { exclude: ["id"] },
    });
    if (!puzzle) {
      res.status(404).json({
        msg: `puzzle not found`,
      });
      return;
    }
    res.json(puzzle);
    return;
  },

  searchPaddle: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const paddle = await paddleModel.findAll({
      where: { paddle_user_uuid: uuid },
      include: [
        { model: userModel, as: `paddle_user_uu` },
        { model: auctionModel, as: `paddle_auction_uu` },
      ],
      attributes: { exclude: ["id"] },
    });
    if (!paddle) {
      res.status(404).json({
        msg: `paddle not found`,
      });
      return;
    }
    res.json(paddle);
    return;
  },

  searchLikes: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const likes = await likesModel.findAll({
      where: { likes_user_uuid: uuid },
      include: [
        { model: userModel, as: `likes_user_uu` },
        { model: auctionModel, as: `likes_auction_uu` },
      ],
      attributes: { exclude: ["id"] },
    });
    if (!likes) {
      res.status(404).json({
        msg: `likes not found`,
      });
      return;
    }
    res.json(likes);
    return;
  },

  searchBid: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const bid = await bidModel.findAll({
      where: { bid_user_uuid: uuid },
      include: [
        { model: userModel, as: `bid_user_uu` },
        { model: auctionModel, as: `bid_auction_uu` },
      ],
      attributes: { exclude: ["id"] },
    });
    if (!bid) {
      res.status(404).json({
        msg: `bid not found`,
      });
      return;
    }
    res.json(bid);
    return;
  },

  searchArt: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const art = await artModel.findAll({
      where: { art_artist_uuid: uuid },
      include: ["auctions"],
      attributes: { exclude: ["id"] },
    });
    if (!art) {
      res.status(404).json({
        msg: `art not found`,
      });
      return;
    }
    res.json(art);
    return;
  },
};
