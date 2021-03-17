"use strict";
const SwaggerExpress = require("swagger-express-mw");
const SwaggerUi = require("swagger-tools/middleware/swagger-ui");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const port = process.env.PORT || 9000;
const app = require("express")();
require("dotenv").config;


const config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    api_key: function (req, authOrSecDef, scopesOrApiKey, cb) {
      // 요청 헤더 값이 api_key이고, 값이 'tjwjddnr'일 경우에만 실행 허용
      if ("tjwjddnr" === scopesOrApiKey) {
        cb();
      } else {
        cb(new Error("Access Denied"));
      }
    },
  },
};



SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

  swaggerExpress.register(app);
  swaggerExpress.runner.swagger.host = "dosc.exitgift.shop/docs:9000";
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  app.use(express.json());
  const server = https
  .createServer(
    {
      key: fs.readFileSync("/" + process.env.KEY_PATH, "utf-8"),
      cert: fs.readFileSync("/" + process.env.CERT_PATH, "utf-8"),
    },
    app
  );

  server.listen(port, () =>
  console.log("server https://dosc.exitgift.shop/docs:9000")
  );
  
  module.exports = server; // for testing
});

// 9000번 or 10000번
// url : https://dosc.exitgift.shop/dosc
