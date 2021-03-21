// 모델 불러오기

const likesModel = require("../../models").likes;
const auctionModel = require("../../models").auction;
const userModel = require("../../models").user;
const moment = require("moment");
moment().format();

module.exports = {
  list: async (req, res) => {
    const list = await likesModel.findAll({
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
    const likes = await likesModel.findOne({
      where: { uuid: uuid },
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
  searchAuction: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const likes = await likesModel.findAll({
      where: { likes_auction_uuid: uuid },
      attributes: { exclude: ["id"] },
    });
    if (!likes) {
      res.status(404).json({
        msg: `auction not found`,
      });
      return;
    }
    res.json(likes);
    return;
  },
  searchUser: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const likes = await likesModel.findAll({
      where: { likes_user_uuid: uuid },
      attributes: { exclude: ["id", "user_password"] },
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
  upload: async (req, res) => {
    let { auction_uuid, user_uuid } = req.body;
    if (!auction_uuid || !user_uuid) {
      res.status(400).json({
        msg: `property required`,
      });
      return;
    }
    const auction = await auctionModel.findOne({
      where: { uuid: auction_uuid },
      attributes: [`uuid`],
    });
    if (!auction) {
      res.status(400).json({
        msg: `auction not found`,
      });
      return;
    }
    const user = await userModel.findOne({
      where: { uuid: user_uuid },
      attributes: [`uuid`],
    });
    if (!user) {
      res.status(400).json({
        msg: `user not found`,
      });
      return;
    }
    const likesObj = {
      likes_auction_uuid: auction.dataValues.uuid,
      likes_user_uuid: user.dataValues.uuid,
    };
    const likes = await likesModel.create(likesObj);
    if (!likes) {
      res.status(500).json({
        msg: `insert error`,
      });
      return;
    }

    const likesFind = await likesModel.findOne({
      where: { uuid: likes.dataValues.uuid },
      attributes: { exclude: ["id"] },
    });

    if (!likesFind) {
      res.status(400).json({
        msg: `likes not found`,
      });
      return;
    }
    res.json(likesFind.dataValues);
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

    const likesFind = await likesModel.findOne({
      where: { uuid },
      attributes: { exclude: ["id"] },
    });

    if (!likesFind) {
      res.status(400).json({
        msg: `likes not found`,
      });
      return;
    }

    const deleted = await likesModel.destroy({
      where: { uuid },
    });
    if (!deleted) {
      res.status(500).json({
        msg: `delete error`,
      });
      return;
    }
    res.json(likesFind.dataValues);
    return;
  },
};
