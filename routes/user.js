const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/accesstokenrequest", userController.accessTokenRequest);
router.get("/refreshtokenrequest", userController.refreshTokenRequest);
router.delete("/signout", userController.signout);

module.exports = router;
