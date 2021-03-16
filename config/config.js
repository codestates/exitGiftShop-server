const dotenv = require("dotenv");
dotenv.config();

const config = {
  development: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "exitGift",
    dialect: "mariadb",
    logging: false,
  },
};

module.exports = config;
