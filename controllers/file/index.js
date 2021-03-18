const fileModel = require("../../models").file;
const { UPLOAD_PATH } = process.env;

module.exports = {
  upload: async (req, res) => {
    const path = __dirname + UPLOAD_PATH
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const { name, data } = req.files[0];
    await fileModel.findOrCreate({
      where: { file_name: name },
      defaults: { file_name: name,
        file_data: data
      }
    }).spread(function (file, created) {
      if (created) {
        res.json({
          msg : `file upload clear`
        })
        return;
      }
      res.status(400).json({
        msg : `already exist file`
      });
      return;
    })
    
  },
  preview: async (req, res) => {
    const { id } = req.params;
    const file = await fileModel.findOne({ where: { id } });
    if (file === null) {
      res.status(404).json({
        msg : `file not found`
      })
      return;
    } else {
      console.log(file);
      res.json({ 
        msg : `find ${file}`
      })
      return;
    }
  }
};