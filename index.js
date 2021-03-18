const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = 4000;

// router
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

// use
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use("/", indexRouter);
app.use("/user", userRouter);

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
  .listen(port, () => console.log("https://back.exitgift.shop:4000/docs"));
// .listen(port, () => console.log("https://localhost:4000/docs"));

module.exports = server;
