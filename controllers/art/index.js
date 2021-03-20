// 모델 불러오기
const artModel = require("../../models").art;
const userModel = require("../../models").user;
const fileModel = require("../../models").file;

module.exports = {
  list: async (req, res) => {
    const list = await artModel.findAll({ 
      include: [ `auctions` ],
      attributes: { exclude: ['id'] }
    });
    if (!list) {
      res.status(404).json({
        msg : `art not found`
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
    const art = await artModel.findOne({ 
      where: { uuid: uuid },
      include: [ `auctions` ],
      attributes: { exclude: ['id'] }
    });
    if (!art) {
      res.status(404).json({
        msg : `art not found`
      })
      return;
    }
    res.json(art);
    return;
  },
  searchArtist: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg : `uuid is required`
      })
      return;
    }
    const art = await artModel.findAll({ 
      where: { art_artist_uuid: uuid },
      include: [ `auctions` ],
      attributes: { exclude: ['id'] }
    });
    if (!art) {
      res.status(404).json({
        msg : `art not found`
      })
      return;
    }
    res.json(art);
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
    const [art, created] = await artModel.findOrCreate({
      where: { art_title: title },
      defaults: artObj
    });
    if (created) {
      res.json(art.dataValues);
      return;
    }
    res.status(500).json({
      msg: `title already exist`
    });
    return;  
  },
  updateOne: async (req, res) => {
    const { artist_uuid, file_id, title, desc, twitter } = req.body;
    const uuid = req.params.uuid;
    if (!uuid) {
      res.status(400).json({
        msg : `uuid is required`
      })
      return;
    }

    const artFind = await artModel.findOne({ 
      where: { uuid },
      attributes: [`uuid`]
    });
    if (!artFind) {
      res.status(400).json({
        msg: `art not found`
      });
      return;
    }
    const artObj = {};
    if (artist_uuid) {
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
      artObj.art_artist_uuid = artist.dataValues.uuid;
    }
    if (file_id) {
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
      artObj.art_file_id = file.dataValues.id;
    }

    if (title) artObj.art_title = title;
    if (desc) artObj.art_desc = desc;
    if (twitter) artObj.art_twitter = twitter;
    const updated = await artModel.update(artObj, {
      where : { uuid }
    });
    if (!updated) {
      res.status(500).json({
        msg: `update error`
      });
      return;
    }
    const art = await artModel.findOne({ 
      where: { uuid },
      attributes: { exclude: ['id'] }
    });
    if (!art) {
      res.status(400).json({
        msg: `art not found`
      });
      return;
    }
    res.json(art);
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

    const artFind = await artModel.findOne({ 
      where: { uuid },
      include: [ `auctions` ],
      attributes: { exclude: ['id'] }
    });
    
    if (!artFind) {
      res.status(400).json({
        msg: `art not found`
      });
      return;
    }

    try {
      const deleted = await artModel.destroy({
        where: { uuid }
      });
    } catch(err) {
      res.status(500).json({
        msg : `data referenced by another dater`,
        data : artFind.dataValues
      });
      return;
    }
    if (!deleted) {
      res.status(500).json({
        msg : `delete error`
      })
      return;
    }
    res.json(artFind.dataValues);
    return;
  },
};