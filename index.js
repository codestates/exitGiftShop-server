require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const cookieParser = require("cookie-parser");
const port = 4000;

// cryto test
const CryptoJS = require("crypto-js");
const ciphertext = CryptoJS.AES.encrypt("1", process.env.SALT).toString();
const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SALT);
var originalText = bytes.toString(CryptoJS.enc.Utf8);
console.log(originalText);

// views
app.set("view engine", "ejs");

// router
const userRouter = require("./routes/user");
const auctionRouter = require("./routes/auction");
const fileRouter = require("./routes/file");
const artRouter = require("./routes/art");
const puzzleRouter = require("./routes/puzzle");
const paddleRouter = require("./routes/paddle");
const likesRouter = require("./routes/likes");
const bidRouter = require("./routes/bid");
const loginRouter = require("./routes/login");

// use
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// router
app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/auction", auctionRouter);
app.use("/art", artRouter);
app.use("/puzzle", puzzleRouter);
app.use("/paddle", paddleRouter);
app.use("/likes", likesRouter);
app.use("/bid", bidRouter);
app.use("/", loginRouter);

// https
const server = https
  .createServer(
    {
      // key: fs.readFileSync("/" + process.env.KEY_PATH, "utf-8"),
      // cert: fs.readFileSync("/" + process.env.CERT_PATH, "utf-8"),
      key: fs.readFileSync(__dirname + "/key.pem", "utf-8"),
      cert: fs.readFileSync(__dirname + "/cert.pem", "utf-8"),
    },
    app
  )
  // .listen(port, () => console.log("https://back.exitgift.shop:4000"));
  .listen(port, () => console.log("https://localhost:4000"));

module.exports = server;
