const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/", userController);
router.post("/", userController);
router.put("/", userController);
router.delete("/", userController);

module.exports = router;
