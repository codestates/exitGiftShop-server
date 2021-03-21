const express = require("express");
const router = express.Router();

const paddleController = require("../controllers/paddle");

router.get("/", paddleController.list);
router.get("/:uuid", paddleController.search);
router.get("/user/:uuid", paddleController.searchUser);
router.get("/auction/:uuid", paddleController.searchAuction);
router.post("/", paddleController.upload);
router.delete("/:uuid", paddleController.deleteOne);

module.exports = router;
