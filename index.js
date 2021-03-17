const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const fs = require("fs");
const https = require("https");
require("dotenv").config();

// use
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// get
app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

// https
const server = https
  .createServer(
    {
      key: fs.readFileSync("/" + process.env.KEY_PATH, "utf-8"),
      cert: fs.readFileSync("/" + process.env.CERT_PATH, "utf-8"),
      // key: fs.readFileSync(__dirname + "/key.pem", "utf-8"),
      // cert: fs.readFileSync(__dirname + "/cert.pem", "utf-8"),
    },
    app
  )
  .listen(port, () => console.log("https://back.exitgift.shop:4000/docs"));
// .listen(port, () => console.log("https://localhost:4000/docs"));

module.exports = server;
