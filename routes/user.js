const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/accesstokenrequest", userController.accessTokenRequest);
router.get("/refreshtokenrequest", userController.refreshTokenRequest);
router.post("/signout", userController.signout);

//get
router.get("/", userController.list);
router.get("/:uuid", userController.search);
router.get("/puzzle/:uuid", userController.searchPuzzle);
router.get("/paddle/:uuid", userController.searchPaddle);
router.get("/likes/:uuid", userController.searchLikes);
router.get("/bid/:uuid", userController.searchBid);
router.get("/art/:uuid", userController.searchArt);

// google oauth
router.post("/callback", userController.callback);

module.exports = router;
