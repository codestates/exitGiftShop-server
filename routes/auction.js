const express = require("express");
const router = express.Router();

const auctionController = require("../controllers/auction");

router.get("/", auctionController.list);
router.get("/:uuid", auctionController.search);
router.get("/art/:uuid", auctionController.searchArt);
router.post("/", auctionController.upload);
router.put("/:uuid", auctionController.updateOne);
router.delete("/:uuid", auctionController.deleteOne);

module.exports = router;
