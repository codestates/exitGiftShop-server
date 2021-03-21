// 모델 불러오기

const paddleModel = require("../../models").paddle;
const auctionModel = require("../../models").auction;
const userModel = require("../../models").user;
const moment = require("moment");
moment().format();

module.exports = {
  list: async (req, res) => {
    const list = await paddleModel.findAll({
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
    const paddle = await paddleModel.findOne({
      where: { uuid: uuid },
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
  searchAuction: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const paddle = await paddleModel.findAll({
      where: { paddle_auction_uuid: uuid },
      attributes: { exclude: ["id"] },
    });
    if (!paddle) {
      res.status(404).json({
        msg: `auction not found`,
      });
      return;
    }
    res.json(paddle);
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
    const paddle = await paddleModel.findAll({
      where: { paddle_user_uuid: uuid },
      attributes: { exclude: ["id", "user_password"] },
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
  upload: async (req, res) => {
    let { auction_uuid, user_uuid, price } = req.body;
    if (!auction_uuid || !user_uuid || !price) {
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
    const paddleObj = {
      paddle_auction_uuid: auction.dataValues.uuid,
      paddle_user_uuid: user.dataValues.uuid,
      paddle_price: price,
    };
    const paddle = await paddleModel.create(paddleObj);
    if (!paddle) {
      res.status(500).json({
        msg: `insert error`,
      });
      return;
    }

    const paddleFind = await paddleModel.findOne({
      where: { uuid: paddle.dataValues.uuid },
      attributes: { exclude: ["id", "user_password"] },
    });

    if (!paddleFind) {
      res.status(400).json({
        msg: `paddle not found`,
      });
      return;
    }
    res.json(paddleFind.dataValues);
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

    const paddleFind = await paddleModel.findOne({
      where: { uuid },
      attributes: { exclude: ["id"] },
    });

    if (!paddleFind) {
      res.status(400).json({
        msg: `paddle not found`,
      });
      return;
    }

    const deleted = await paddleModel.destroy({
      where: { uuid },
    });
    if (!deleted) {
      res.status(500).json({
        msg: `delete error`,
      });
      return;
    }
    res.json(paddleFind.dataValues);
    return;
  },
};
