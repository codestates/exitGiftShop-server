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

let server;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  server = https
    .createServer(
      {
        key: fs.readFileSync(__dirname + `/` + "key.pem", "utf-8"),
        cert: fs.readFileSync(__dirname + `/` + "cert.pem", "utf-8"),
      },
      app
    )
    .listen(port);
} else {
  server = app.listen(port);
}

module.exports = server;
