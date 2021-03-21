const express = require("express");
const router = express.Router();

const bidController = require("../controllers/bid");

router.get("/", bidController.list);
router.get("/:uuid", bidController.search);
router.get("/user/:uuid", bidController.searchUser);
router.get("/auction/:uuid", bidController.searchAuction);
router.post("/", bidController.upload);
router.delete("/:uuid", bidController.deleteOne);

module.exports = router;
