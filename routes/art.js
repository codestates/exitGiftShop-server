const express = require("express");
const router = express.Router();

const artController = require("../controllers/art");

router.get("/", artController.list);
router.post("/upload", artController.upload);
router.get("/:uuid", artController.search);
router.get("/user/:uuid", artController.searchArtist);
router.put("/:uuid", artController.updateOne);
router.delete("/:uuid", artController.deleteOne);

module.exports = router;
