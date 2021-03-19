// 모델 불러오기

const puzzleModel = require("../../models").puzzle;
const artModel = require("../../models").art;
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
  searchArt: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg : `uuid is required`
      })
      return;
    }
    const puzzle = await puzzleModel.findAll({ 
      where: { puzzle_art_uuid: uuid },
      attributes: { exclude: ['id'] }
    });
    if (!puzzle) {
      res.status(404).json({
        msg : `art not found`
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
        msg : `art not found`
      })
      return;
    }
    res.json(puzzle);
    return;
  },
  upload: async (req, res) => {
    let { art_uuid, user_uuid } = req.body;
    if (!art_uuid || !user_uuid) {
      res.status(400).json({
        msg: `property required`
      });
      return;
    }
    const art = await artModel.findOne({ 
      where: {uuid: art_uuid },
      attributes: [`uuid`]
    });
    if (!art) {
      res.status(400).json({
        msg: `art not found`
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
      puzzle_art_uuid: art.dataValues.uuid,
      puzzle_user_uuid: user.dataValues.uuid,
    }
    const [puzzle, created] = await puzzleModel.findOrCreate({
      where: { puzzle_art_uuid: art.dataValues.uuid, puzzle_user_uuid: user.dataValues.uuid },
      defaults: puzzleObj
    })
    if (created) {
      res.json(puzzle.dataValues);
      return;
    }
    res.status(500).json({
      msg: `puzzle already exist`
    });
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