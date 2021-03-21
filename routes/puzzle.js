const express = require("express");
const router = express.Router();

const puzzleController = require("../controllers/puzzle");

router.get("/", puzzleController.list);
router.get("/:uuid", puzzleController.search);
router.get("/user/:uuid", puzzleController.searchUser);
router.get("/auction/:uuid", puzzleController.searchAuction);
router.post("/", puzzleController.upload);
router.delete("/:uuid", puzzleController.deleteOne);

module.exports = router;
