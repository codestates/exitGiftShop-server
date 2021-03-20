const express = require("express");
const router = express.Router();

const likesController = require("../controllers/likes");

router.get("/", likesController.list);
router.get("/:uuid", likesController.search);
router.get("/user/:uuid", likesController.searchUser);
router.get("/auction/:uuid", likesController.searchAuction);
router.post("/", likesController.upload);
router.delete("/:uuid", likesController.deleteOne);

module.exports = router;
