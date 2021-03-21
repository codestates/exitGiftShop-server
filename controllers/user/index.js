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

// function
module.exports = {
  list: async (req, res) => {
    const list = await userModel.findAll({
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
      attributes: { exclude: ["id", "user_password"] },
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
          attributes: { exclude: ["id"] },
        },
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
        {
          model: userModel,
          as: `bid_user_uu`,
          attributes: { exclude: ["id", "user_password"] },
        },
        {
          model: auctionModel,
          as: `bid_auction_uu`,
          attributes: { exclude: ["id"] },
        },
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
      include: [
        {
          model: userModel,
          as: "art_artist_uu",
          attributes: { exclude: ["id", "user_password"] },
        },
      ],
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
