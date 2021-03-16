const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const fs = require("fs");
const https = require("https");
const { KEY_PATH, CERT_PATH } = process.env;

app.use(express.json());
app.use(cors());

// get
app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

const server = https.createServer({
  key: fs.readFileSync(KEY_PATH, 'utf-8'),
  cert: fs.readFileSync(CERT_PATH, 'utf-8'),
}, app).listen(port);

module.exports = server;
