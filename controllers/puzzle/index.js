// 모델 불러오기

const puzzleModel = require("../../models").puzzle;
const auctionModel = require("../../models").auction;
const userModel = require("../../models").user;
const moment = require('moment');
moment().format(); 


module.exports = {
  list: async (req, res) => {
    const list = await puzzleModel.findAll({
      attributes: { exclude: ['id'] },
    });
    if (!list) {
      res.status(404).json({
        msg : `auction not found`
      })
      return;
    }
    res.json(list);
    return;
  },
  search: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg : `uuid is required`
      })
      return;
    }
    const puzzle = await puzzleModel.findOne({ 
      where: { uuid: uuid },
      attributes: { exclude: ['id'] }
    });
    if (!puzzle) {
      res.status(404).json({
        msg : `puzzle not found`
      })
      return;
    }
    res.json(puzzle);
    return;
  },
  searchAuction: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg : `uuid is required`
      })
      return;
    }
    const puzzle = await puzzleModel.findAll({ 
      where: { puzzle_auction_uuid: uuid },
      attributes: { exclude: ['id'] }
    });
    if (!puzzle) {
      res.status(404).json({
        msg : `auction not found`
      })
      return;
    }
    res.json(puzzle);
    return;
  },
  searchUser: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg : `uuid is required`
      })
      return;
    }
    const puzzle = await puzzleModel.findAll({ 
      where: { puzzle_user_uuid: uuid },
      attributes: { exclude: ['id'] }
    });
    if (!puzzle) {
      res.status(404).json({
        msg : `puzzle not found`
      })
      return;
    }
    res.json(puzzle);
    return;
  },
  upload: async (req, res) => {
    let { auction_uuid, user_uuid, price } = req.body;
    if (!auction_uuid || !user_uuid || !price) {
      res.status(400).json({
        msg: `property required`
      });
      return;
    }
    const auction = await auctionModel.findOne({ 
      where: {uuid: auction_uuid },
      attributes: [`uuid`]
    });
    if (!auction) {
      res.status(400).json({
        msg: `auction not found`
      });
      return;
    }
    const user = await userModel.findOne({ 
      where: {uuid: user_uuid },
      attributes: [`uuid`]
    });
    if (!user) {
      res.status(400).json({
        msg: `user not found`
      });
      return;
    }
    const puzzleObj = { 
      puzzle_auction_uuid: auction.dataValues.uuid,
      puzzle_user_uuid: user.dataValues.uuid,
      puzzle_price: price,
    }
    const puzzle = await puzzleModel.create(puzzleObj)
    if (!puzzle) {
      res.status(500).json({
        msg: `insert error`
      });
      return;  
    }
    
    const puzzleFind = await puzzleModel.findOne({ 
      where: { uuid: puzzle.dataValues.uuid },
      attributes: { exclude: ['id'] }
    });
    
    if (!puzzleFind) {
      res.status(400).json({
        msg: `puzzle not found`
      });
      return;
    }
    res.json(puzzleFind.dataValues);
    return;
  },
  deleteOne: async (req, res) => {
    const uuid = req.params.uuid;

    if (!uuid) {
      res.status(400).json({
        msg : `uuid is required`
      })
      return;
    }

    const puzzleFind = await puzzleModel.findOne({ 
      where: { uuid },
      attributes: { exclude: ['id'] }
    });
    
    if (!puzzleFind) {
      res.status(400).json({
        msg: `puzzle not found`
      });
      return;
    }

    const deleted = await puzzleModel.destroy({
      where: { uuid }
    });
    if (!deleted) {
      res.status(500).json({
        msg : `delete error`
      })
      return;
    }
    res.json(puzzleFind.dataValues);
    return;
  },
};