const express = require("express");
const router = express.Router();

const auctionController = require("../controllers/auction");

router.get("/test", auctionController.test);
// router.post("/", auctionController);
// router.put("/", auctionController);
// router.delete("/", auctionController);

module.exports = router;
