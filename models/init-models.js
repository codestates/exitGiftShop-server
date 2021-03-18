var DataTypes = require("sequelize").DataTypes;
var _art = require("./art");
var _auction = require("./auction");
var _bid = require("./bid");
var _file = require("./file");
var _invite = require("./invite");
var _likes = require("./likes");
var _paddle = require("./paddle");
var _puzzle = require("./puzzle");
var _user = require("./user");

function initModels(sequelize) {
  var art = _art(sequelize, DataTypes);
  var auction = _auction(sequelize, DataTypes);
  var bid = _bid(sequelize, DataTypes);
  var file = _file(sequelize, DataTypes);
  var invite = _invite(sequelize, DataTypes);
  var likes = _likes(sequelize, DataTypes);
  var paddle = _paddle(sequelize, DataTypes);
  var puzzle = _puzzle(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  auction.belongsTo(art, { as: "art_uu", foreignKey: "art_uuid"});
  art.hasMany(auction, { as: "auctions", foreignKey: "art_uuid"});
  paddle.belongsTo(art, { as: "paddle_art_uu", foreignKey: "paddle_art_uuid"});
  art.hasMany(paddle, { as: "paddles", foreignKey: "paddle_art_uuid"});
  puzzle.belongsTo(art, { as: "puzzle_art_uu", foreignKey: "puzzle_art_uuid"});
  art.hasMany(puzzle, { as: "puzzles", foreignKey: "puzzle_art_uuid"});
  bid.belongsTo(auction, { as: "auction_uu", foreignKey: "auction_uuid"});
  auction.hasMany(bid, { as: "bids", foreignKey: "auction_uuid"});
  likes.belongsTo(auction, { as: "auction_uu", foreignKey: "auction_uuid"});
  auction.hasMany(likes, { as: "likes", foreignKey: "auction_uuid"});
  art.belongsTo(file, { as: "art_file", foreignKey: "art_file_id"});
  file.hasMany(art, { as: "arts", foreignKey: "art_file_id"});
  art.belongsTo(user, { as: "art_artist_uu", foreignKey: "art_artist_uuid"});
  user.hasMany(art, { as: "arts", foreignKey: "art_artist_uuid"});
  bid.belongsTo(user, { as: "user_uu", foreignKey: "user_uuid"});
  user.hasMany(bid, { as: "bids", foreignKey: "user_uuid"});
  likes.belongsTo(user, { as: "user_uu", foreignKey: "user_uuid"});
  user.hasMany(likes, { as: "likes", foreignKey: "user_uuid"});
  paddle.belongsTo(user, { as: "paddle_user_uu", foreignKey: "paddle_user_uuid"});
  user.hasMany(paddle, { as: "paddles", foreignKey: "paddle_user_uuid"});
  puzzle.belongsTo(user, { as: "puzzle_user_uu", foreignKey: "puzzle_user_uuid"});
  user.hasMany(puzzle, { as: "puzzles", foreignKey: "puzzle_user_uuid"});

  return {
    art,
    auction,
    bid,
    file,
    invite,
    likes,
    paddle,
    puzzle,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
