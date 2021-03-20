const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

// token jwt
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/accesstokenrequest", userController.accessTokenRequest);
router.get("/refreshtokenrequest", userController.refreshTokenRequest);
router.post("/signout", userController.signout);

// google oauth
router.post("/callback", userController.callback);
router.get("/signoutoauth", userController.signoutoauth);
router.get("/", userController.helloRender);
// router.get("/dashboard", userController.dashboard);

module.exports = router;
