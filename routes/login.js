const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login");

router.post("/signup", loginController.signup);
router.post("/signin", loginController.signin);
router.get("/accesstokenrequest", loginController.accessTokenRequest);
router.get("/refreshtokenrequest", loginController.refreshTokenRequest);

// google oauth
router.post("/callback", loginController.callback);

/* Oauth test */
router.get("/", function (req, res) {
  res.render("login");
});

// 로그아웃
router.get("/signout", (req, res) => {
  res.clearCookie("refreshToken");
  res.redirect("/");
});

module.exports = router;
