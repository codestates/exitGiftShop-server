// models
const userModel = require("../../models").user;
const puzzleModel = require("../../models").puzzle;
const auctionModel = require("../../models").auction;
const paddleModel = require("../../models").paddle;
const likesModel = require("../../models").likes;
const bidModel = require("../../models").bid;
const artModel = require("../../models").art;
const CryptoJS = require("crypto-js");
// .env
require("dotenv").config();

// function
module.exports = {
  list: async (req, res) => {
    const list = await userModel.findAll({
      include: [`arts`, `bids`, `likes`, `paddles`, `puzzles`],
      order: [
        [`bids`, `id`, `DESC`],
        [`puzzles`, `updatedAt`, `DESC`],
        [`paddles`, `updatedAt`, `DESC`],
        [`likes`, `updatedAt`, `DESC`],
        [`arts`, `updatedAt`, `DESC`],
      ],
      attributes: { exclude: ["id", "user_password"] },
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
      include: [`arts`, `bids`, `likes`, `paddles`, `puzzles`],
      order: [
        [`bids`, `id`, `DESC`],
        [`puzzles`, `updatedAt`, `DESC`],
        [`paddles`, `updatedAt`, `DESC`],
        [`likes`, `updatedAt`, `DESC`],
        [`arts`, `updatedAt`, `DESC`],
      ],
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
        {
          model: userModel,
          as: `puzzle_user_uu`,
          attributes: { exclude: ["id", "user_password"] },
        },
        {
          model: auctionModel,
          as: `puzzle_auction_uu`,
          attributes: { exclude: ["id"] },
        },
      ],
      order: [[`updatedAt`, `DESC`]],
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
        {
          model: userModel,
          as: `paddle_user_uu`,
          attributes: { exclude: ["id", "user_password"] },
        },
        {
          model: auctionModel,
          as: `paddle_auction_uu`,
          attributes: { exclude: ["id"] },
        },
      ],
      order: [[`updatedAt`, `DESC`]],
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
        {
          model: userModel,
          as: `likes_user_uu`,
          attributes: { exclude: ["id", "user_password"] },
        },
        {
          model: auctionModel,
          as: `likes_auction_uu`,
          include: ["art_uu"],
          attributes: { exclude: ["id"] },
        },
      ],
      order: [[`updatedAt`, `DESC`]],
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
        {
          model: userModel,
          as: `bid_user_uu`,
          attributes: { exclude: ["id", "user_password"] },
        },
        {
          model: auctionModel,
          as: `bid_auction_uu`,
          include: ["art_uu"],
          attributes: { exclude: ["id"] },
        },
      ],
      order: [[`id`, `DESC`]],
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
      include: [
        {
          model: userModel,
          as: "art_artist_uu",
          attributes: { exclude: ["id", "user_password"] },
        },
      ],
      order: [[`updatedAt`, `DESC`]],
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
  updateOne: async (req, res) => {
    let {
      user_password,
      user_email,
      user_nick,
      user_use_currency,
      user_use_language,
      user_type,
      wallet_now_deposit,
      wallet_now_coin,
      pd,
    } = req.body;

    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }

    // const password = req.params.password;

    // const userFind = await userModel.findOne({
    //   where: { uuid },
    // });
    // if (!userFind) {
    //   res.status(404).json({
    //     msg: `user not found`,
    //   });
    //   return;
    // }
    // const bytes = CryptoJS.AES.decrypt(
    //   userFind.dataValues.user_password,
    //   process.env.SALT
    // );
    // let originalText = bytes.toString(CryptoJS.enc.Utf8);
    // if (originalText !== password) {
    //   res.status(401).json({ msg: "not auth" });
    //   return;
    // }

    const userObj = {};

    if (user_password) {
      const ciphertext = CryptoJS.AES.encrypt(
        user_password,
        process.env.SALT
      ).toString();

      userObj.user_password = ciphertext;
    }
    if (user_email) userObj.user_email = user_email;
    if (user_nick) userObj.user_nick = user_nick;
    if (user_use_language) userObj.user_use_language = user_use_language;
    if (user_use_currency) userObj.user_use_currency = user_use_currency;
    if (user_type) userObj.user_type = user_type;
    if (wallet_now_deposit) userObj.wallet_now_deposit = wallet_now_deposit;
    if (wallet_now_coin) userObj.wallet_now_coin = wallet_now_coin;
    if (pd) userObj.pd = pd;

    const updated = await userModel.update(userObj, {
      where: { uuid },
    });
    if (!updated) {
      res.status(500).json({
        msg: `update error`,
      });
      return;
    }
    const user = await userModel.findOne({
      include: [`arts`, `bids`, `likes`, `paddles`, `puzzles`],
      order: [
        [`bids`, `id`, `DESC`],
        [`puzzles`, `updatedAt`, `DESC`],
        [`paddles`, `updatedAt`, `DESC`],
        [`likes`, `updatedAt`, `DESC`],
        [`arts`, `updatedAt`, `DESC`],
      ],
      attributes: { exclude: ["id"] },
      where: { uuid },
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
};
