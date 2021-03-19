const express = require("express");
const router = express.Router();

const artController = require("../controllers/art");

router.get("/", artController.list);
router.post("/upload", artController.upload);
// router.put("/", auctionController);
// router.delete("/", auctionController);

module.exports = router;
