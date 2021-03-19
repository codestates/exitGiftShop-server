const express = require("express");
const router = express.Router();

const fileController = require("../controllers/file");

router.get("/", fileController.list);
router.get("/:id", fileController.preview);
// router.put("/", auctionController);
// router.delete("/", auctionController);

module.exports = router;
