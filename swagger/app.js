"use strict";

var SwaggerExpress = require("swagger-express-mw");
var SwaggerUi = require("swagger-tools/middleware/swagger-ui");

var app = require("express")();
module.exports = app; // for testing

var config = {
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

  // install middleware
  swaggerExpress.register(app);
  swaggerExpress.runner.swagger.host = "dosc.exitgift.shop/docs:9000";
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  var port = process.env.PORT || 9000;
  app.listen(port, () =>
    console.log("server https://dosc.exitgift.shop/docs:9000")
  );
});

// 9000번 or 10000번
// url : https://dosc.exitgift.shop/dosc
