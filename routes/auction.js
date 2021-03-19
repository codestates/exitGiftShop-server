const express = require("express");
const router = express.Router();

const auctionController = require("../controllers/auction");

router.get("/", auctionController.list);
router.get("/:uuid", auctionController.search);
router.post("/", auctionController.upload);
// router.put("/", auctionController);
// router.delete("/", auctionController);

module.exports = router;
