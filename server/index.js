const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const fs = require("fs");
const https = require("https");
require("dotenv").config;

app.use(express.json());
app.use(cors());

// get
app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

// const server = https
//   .createServer(
//     {
//       key: fs.readFileSync("/" + process.env.KEY_PATH, "utf-8"),
//       cert: fs.readFileSync("/" + process.env.CERT_PATH, "utf-8"),
//     },
//     app
//   )
//   .listen(port);

// module.exports = server;

// local test

app.get("/adder", (req, res) => {
  let one = req.query.one;
  let two = req.query.two;
  let result = Number(one) + Number(two);
  res.send(String(result));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
