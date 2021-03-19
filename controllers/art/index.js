// 모델 불러오기
const artModel = require("../../models").art;
const userModel = require("../../models").user;
const fileModel = require("../../models").file;

module.exports = {
  list: async (req, res) => {
    const list = await artModel.findAll({ 
      attributes: { exclude: ['id'] }
    });
    if (!list) {
      res.status(404).json({
        msg : `file not found`
      })
      return;
    }
    res.json(list);
    return;
  },
  upload: async (req, res) => {
    const { artist_uuid, file_id, title, desc, twitter } = req.body;
    if (!artist_uuid || !file_id || !title || !desc || !twitter) {
      res.status(400).json({
        msg: `property required`
      });
      return;
    }
    // const { art_artist_uuid, art_file_uuid, art_title, art_desc, art_twitter } = req.body;
      const artist = await userModel.findOne({ 
        where: {uuid: artist_uuid },
        attributes: [`uuid`]
      });
      if (!artist) {
        res.status(400).json({
          msg: `artist not found`
        });
        return;
      }
      const file = await fileModel.findOne({ 
        where: {id: file_id},
        attributes: [`id`]
      });
      if (!file) {
        res.status(400).json({
          msg: `file not found`
        });
        return;
      }
      const artObj = { 
        art_file_id: file.dataValues.id,
        art_artist_uuid: artist.dataValues.uuid,
        art_title: title,
        art_desc: desc,
        art_twitter: twitter
      }
      const art = await artModel.create(artObj)
      if (!art) {
        res.status(500).json({
          msg: `insert error`
        });
        return;
      }
      res.json(artObj);
      return;
  }
};