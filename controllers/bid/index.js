// 모델 불러오기

const bidModel = require("../../models").bid;
const auctionModel = require("../../models").auction;
const userModel = require("../../models").user;
const moment = require("moment");
moment().format();

module.exports = {
  list: async (req, res) => {
    const list = await bidModel.findAll({
      attributes: { exclude: ["id"] },
      order: [
        [`updatedAt`, `DESC`],
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
    const bid = await bidModel.findOne({
      where: { uuid: uuid },
      order: [
        [`updatedAt`, `DESC`],
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
  searchAuction: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg: `uuid is required`,
      });
      return;
    }
    const bid = await bidModel.findAll({
      where: { bid_auction_uuid: uuid },
      order: [
        [`updatedAt`, `DESC`],
      ],
      attributes: { exclude: ["id"] },
    });
    if (!bid) {
      res.status(404).json({
        msg: `auction not found`,
      });
      return;
    }
    res.json(bid);
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
    const bid = await bidModel.findAll({
      where: { bid_user_uuid: uuid },
      attributes: { exclude: ["id", "user_password"] },
      order: [
        [`updatedAt`, `DESC`],
      ],
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
      order: [
        [`updatedAt`, `DESC`],
      ],
      attributes: [`uuid`],
    });
    if (!user) {
      res.status(400).json({
        msg: `user not found`,
      });
      return;
    }
    const bidObj = {
      bid_auction_uuid: auction.dataValues.uuid,
      bid_user_uuid: user.dataValues.uuid,
      bid_price: price,
    };
    const bid = await bidModel.create(bidObj);
    if (!bid) {
      res.status(500).json({
        msg: `insert error`,
      });
      return;
    }

    const bidFind = await bidModel.findOne({
      where: { uuid: bid.dataValues.uuid },
      attributes: { exclude: ["id"] },
    });

    if (!bidFind) {
      res.status(400).json({
        msg: `bid not found`,
      });
      return;
    }
    res.json(bidFind.dataValues);
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

    const bidFind = await bidModel.findOne({
      where: { uuid },
      attributes: { exclude: ["id"] },
    });

    if (!bidFind) {
      res.status(400).json({
        msg: `bid not found`,
      });
      return;
    }

    const deleted = await bidModel.destroy({
      where: { uuid },
    });
    if (!deleted) {
      res.status(500).json({
        msg: `delete error`,
      });
      return;
    }
    res.json(bidFind.dataValues);
    return;
  },
};
