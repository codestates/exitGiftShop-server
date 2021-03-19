// 모델 불러오기

const auctionModel = require("../../models").auction;
const artModel = require("../../models").art;
const moment = require('moment');
moment().format(); 
module.exports = {
  list: async (req, res) => {
    const list = await auctionModel.findAll({ 
      include: [{ model: artModel, as: `art_uu` }],
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
    res.json({ msg : 'test clear'});
  },
  upload: async (req, res) => {
    let { art_uuid, start_time, end_time, hammer_price, now_price, link } = req.body;
    if (!art_uuid || !start_time || !now_price) {
      res.status(400).json({
        msg: `property required`
      });
      return;
    }
    start_time = moment(start_time).format();
    
    if (!end_time) {
      end_time = moment(start_time).add(1, 'days').format();
    } else {
      end_time = moment(end_time).format();
    }
    const art = await artModel.findOne({ 
      where: {uuid: art_uuid },
      attributes: [`uuid`, `art_title`]
    });
    if (!art) {
      res.status(400).json({
        msg: `art not found`
      });
      return;
    }
    // const { art_uuid, auction_start_time, auction_end_time, auction_hammer_price, auction_now_price, auction_link } = req.body;
    const auctionObj = { 
      art_uuid: art.dataValues.uuid,
      auction_start_time: start_time,
      auction_end_time: end_time,
      auction_hammer_price: hammer_price,
      auction_now_price: now_price,
      auction_link: link
    }
    const [finded, created] = await auctionModel.findOrCreate({
      where: { art_uuid: art.dataValues.uuid },
      defaults: auctionObj
    });
    if (created) {
      auctionObj.start_time = moment(start_time).format('MMMM Do YYYY, h:mm:ss a');
      auctionObj.end_time = moment(start_time).add(1, 'days').format('MMMM Do YYYY, h:mm:ss a');
      res.json(auctionObj);
      return;
    }
    res.status(500).json({
      msg: `auction already exist`
    });
    return;  
  },
};