const express = require("express");
const router = express.Router();

const fileController = require("../controllers/file");

router.get("/preview/:id", fileController.preview);
router.post("/upload", fileController.upload);
// router.put("/", auctionController);
// router.delete("/", auctionController);

module.exports = router;
