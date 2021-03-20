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

  auction.belongsTo(art, { as: "art_uu", foreignKey: "art_uuid", targetKey: "uuid"});
  art.hasMany(auction, { as: "auctions", foreignKey: "art_uuid", sourceKey: "uuid"});
  paddle.belongsTo(auction, { as: "paddle_auction_uu", foreignKey: "paddle_auction_uuid", targetKey: "uuid"});
  auction.hasMany(paddle, { as: "paddles", foreignKey: "paddle_auction_uuid", sourceKey: "uuid"});
  puzzle.belongsTo(auction, { as: "puzzle_auction_uu", foreignKey: "puzzle_auction_uuid", targetKey: "uuid"});
  auction.hasMany(puzzle, { as: "puzzles", foreignKey: "puzzle_auction_uuid", sourceKey: "uuid"});
  bid.belongsTo(auction, { as: "bid_auction_uu", foreignKey: "bid_auction_uuid", targetKey: "uuid"});
  auction.hasMany(bid, { as: "bids", foreignKey: "bid_auction_uuid", sourceKey: "uuid"});
  likes.belongsTo(auction, { as: "likes_auction_uu", foreignKey: "likes_auction_uuid", targetKey: "uuid"});
  auction.hasMany(likes, { as: "likes", foreignKey: "likes_auction_uuid", sourceKey: "uuid"});
  art.belongsTo(file, { as: "art_file", foreignKey: "art_file_id"});
  file.hasMany(art, { as: "arts", foreignKey: "art_file_id"});
  art.belongsTo(user, { as: "art_artist_uu", foreignKey: "art_artist_uuid", targetKey: "uuid"});
  user.hasMany(art, { as: "arts", foreignKey: "art_artist_uuid", sourceKey: "uuid"});
  bid.belongsTo(user, { as: "bid_user_uu", foreignKey: "bid_user_uuid", targetKey: "uuid"});
  user.hasMany(bid, { as: "bids", foreignKey: "bid_user_uuid", sourceKey: "uuid"});
  likes.belongsTo(user, { as: "likes_user_uu", foreignKey: "likes_user_uuid", targetKey: "uuid"});
  user.hasMany(likes, { as: "likes", foreignKey: "likes_user_uuid", sourceKey: "uuid"});
  paddle.belongsTo(user, { as: "paddle_user_uu", foreignKey: "paddle_user_uuid", targetKey: "uuid"});
  user.hasMany(paddle, { as: "paddles", foreignKey: "paddle_user_uuid", sourceKey: "uuid"});
  puzzle.belongsTo(user, { as: "puzzle_user_uu", foreignKey: "puzzle_user_uuid", targetKey: "uuid"});
  user.hasMany(puzzle, { as: "puzzles", foreignKey: "puzzle_user_uuid", sourceKey: "uuid"});

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
