const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

//get
router.get("/", userController.list);
router.get("/:uuid", userController.search);
router.get("/puzzle/:uuid", userController.searchPuzzle);
router.get("/paddle/:uuid", userController.searchPaddle);
router.get("/likes/:uuid", userController.searchLikes);
router.get("/bid/:uuid", userController.searchBid);
router.get("/art/:uuid", userController.searchArt);

module.exports = router;
