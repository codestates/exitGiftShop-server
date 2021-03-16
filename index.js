const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const fs = require("fs");
const https = require("https");

app.use(express.json());
app.use(cors());

// get
app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

const server = https.createServer({
  key: fs.readFileSync(`/etc/letsencrypt/live/exitgift.shop/privkey.pem`, 'utf-8'),
  cert: fs.readFileSync(`/etc/letsencrypt/live/exitgift.shop/cert.pem`, 'utf-8'),
}, app).listen(port);

module.exports = server;
