const express = require("express");
const router = express.Router();

const puzzleController = require("../controllers/puzzle");

router.get("/", puzzleController.list);
router.post("/", puzzleController.upload);
router.get("/:uuid", puzzleController.search);
router.get("/user/:uuid", puzzleController.searchUser);
router.get("/art/:uuid", puzzleController.searchArt);
router.delete("/:uuid", puzzleController.deleteOne);

module.exports = router;
