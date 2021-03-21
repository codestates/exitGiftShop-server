const express = require("express");
const router = express.Router();

/* Oauth test */
router.get("/", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.get("/signout", (req, res) => {
  res.clearCookie("refreshToken");
  res.redirect("/");
});
module.exports = router;
