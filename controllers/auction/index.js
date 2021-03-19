// 모델 불러오기
const auctionModel = require("../../models").auction;

module.exports = {
  list: async (req, res) => {
    res.json({ msg : 'test clear'});
  }
};