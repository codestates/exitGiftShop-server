// 모델 불러오기

const auctionModel = require("../../models").auction;
const artModel = require("../../models").art;
const bidModel = require("../../models").bid;
const likesModel = require("../../models").likes;
const paddleModel = require("../../models").paddle;
const puzzleModel = require("../../models").puzzle;
const moment = require("moment");
moment().format();

module.exports = {
  list: async (req, res) => {
    const list = await auctionModel.findAll({
      include: [
        {
          model: bidModel,
          as: "bids",
          attributes: { exclude: ["id"] },
        },
        {
          model: likesModel,
          as: "likes",
          attributes: { exclude: ["id"] },
        },
        {
          model: paddleModel,
          as: "paddles",
          attributes: { exclude: ["id"] },
        },
        {
          model: puzzleModel,
          as: "puzzles",
          attributes: { exclude: ["id"] },
        },
        { model: artModel, as: "art_uu"},
      ],
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
    const auction = await auctionModel.findOne({
      where: { uuid: uuid },
      include: [
        {
          model: bidModel,
          as: "bids",
          attributes: { exclude: ["id"] },
        },
        {
          model: likesModel,
          as: "likes",
          attributes: { exclude: ["id"] },
        },
        {
          model: paddleModel,
          as: "paddles",
          attributes: { exclude: ["id"] },
        },
        {
          model: puzzleModel,
          as: "puzzles",
          attributes: { exclude: ["id"] },
        },
        { model: artModel, as: "art_uu"}],
      ],
      attributes: { exclude: ["id"] },
    });
    if (!auction) {
      res.status(404).json({
        msg: `auction not found`,
      });
      return;
    }
    res.json(auction);
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
    const auction = await auctionModel.findAll({
      where: { art_uuid: uuid },
      include: [
        {
          model: bidModel,
          as: "bids",
          attributes: { exclude: ["id"] },
        },
        {
          model: likesModel,
          as: "likes",
          attributes: { exclude: ["id"] },
        },
        {
          model: paddleModel,
          as: "paddles",
          attributes: { exclude: ["id"] },
        },
        {
          model: puzzleModel,
          as: "puzzles",
          attributes: { exclude: ["id"] },
        },
      ],
      attributes: { exclude: ["id"] },
    });
    if (!auction) {
      res.status(404).json({
        msg: `art not found`,
      });
      return;
    }
    res.json(auction);
    return;
  },
  upload: async (req, res) => {
    let {
      art_uuid,
      start_time,
      end_time,
      hammer_price,
      now_price,
      link,
    } = req.body;
    if (!art_uuid || !start_time || !now_price) {
      res.status(400).json({
        msg: `property required`,
      });
      return;
    }
    start_time = moment(start_time).format();

    if (!end_time) {
      end_time = moment(start_time).add(1, "days").format();
    } else {
      end_time = moment(end_time).format();
    }
    const art = await artModel.findOne({
      where: { uuid: art_uuid },
      attributes: [`uuid`, `art_title`],
    });
    if (!art) {
      res.status(400).json({
        msg: `art not found`,
      });
      return;
    }
    const auctionObj = {
      art_uuid: art.dataValues.uuid,
      auction_start_time: start_time,
      auction_end_time: end_time,
      auction_hammer_price: hammer_price,
      auction_now_price: now_price,
      auction_link: link,
    };
    const [auction, created] = await auctionModel.findOrCreate({
      where: { art_uuid: art.dataValues.uuid },
      defaults: auctionObj,
    });
    if (created) {
      res.json(auction.dataValues);
      return;
    }
    res.status(500).json({
      msg: `auction already exist`,
    });
    return;
  },
  updateOne: async (req, res) => {
    let {
      art_uuid,
      start_time,
      end_time,
      hammer_price,
      now_price,
      link,
    } = req.body;

    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }

    start_time = moment(start_time).format();
    if (!end_time) {
      end_time = moment(start_time).add(1, "days").format();
    } else {
      end_time = moment(end_time).format();
    }

    const auctionFind = await auctionModel.findOne({
      where: { uuid },
      attributes: [`uuid`],
    });
    if (!auctionFind) {
      res.status(400).json({
        msg: `auction not found`,
      });
      return;
    }
    const auctionObj = {};

    if (art_uuid) {
      const art = await artModel.findOne({
        where: { uuid: art_uuid },
        attributes: [`uuid`],
      });
      if (!art) {
        res.status(400).json({
          msg: `art not found`,
        });
        return;
      }
      auctionObj.art_uuid = art.dataValues.uuid;
    }

    if (start_time) auctionObj.auction_start_time = start_time;
    if (end_time) auctionObj.auction_end_time = end_time;
    if (hammer_price) auctionObj.auction_hammer_price = hammer_price;
    if (now_price) auctionObj.auction_now_price = now_price;
    if (link) auctionObj.auction_link = link;

    const updated = await auctionModel.update(auctionObj, {
      where: { uuid },
    });
    if (!updated) {
      res.status(500).json({
        msg: `update error`,
      });
      return;
    }
    const auction = await auctionModel.findOne({ 
      include: [ `bids`, `likes`, `paddles`, `puzzles`,
      { model: artModel, as: "art_uu"}],
      where: { uuid }
    });
    if (!auction) {
      res.status(400).json({
        msg: `auction not found`,
      });
      return;
    }
    res.json(auction);
    return;
  },
  deleteOne: async (req, res) => {
    const uuid = req.params.uuid;

    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }

    const auctionFind = await auctionModel.findOne({
      where: { uuid },
      include: [
        {
          model: bidModel,
          as: "bids",
          attributes: { exclude: ["id"] },
        },
        {
          model: likesModel,
          as: "likes",
          attributes: { exclude: ["id"] },
        },
        {
          model: paddleModel,
          as: "paddles",
          attributes: { exclude: ["id"] },
        },
        {
          model: puzzleModel,
          as: "puzzles",
          attributes: { exclude: ["id"] },
        },
        { model: artModel, as: "art_uu"}],
      ],
      attributes: { exclude: ["id"] },
    });

    if (!auctionFind) {
      res.status(400).json({
        msg: `auction not found`,
      });
      return;
    }

    try {
      const deleted = await auctionModel.destroy({
        where: { uuid },
      });
    } catch (err) {
      res.status(500).json({
        msg: `data referenced by another dater`,
        data: auctionFind.dataValues,
      });
      return;
    }
    if (!deleted) {
      res.status(500).json({
        msg: `delete error`,
      });
      return;
    }
    res.json(auctionFind.dataValues);
    return;
  },
};
