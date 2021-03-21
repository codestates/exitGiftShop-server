/*


art.hasMany(auction, { as: "auctions", foreignKey: "art_uuid", sourceKey: "uuid"});

auction.hasMany(bid, { as: "bids", foreignKey: "bid_auction_uuid", sourceKey: "uuid"});
auction.hasMany(likes, { as: "likes", foreignKey: "likes_auction_uuid", sourceKey: "uuid"});
auction.hasMany(paddle, { as: "paddles", foreignKey: "paddle_art_uuid", sourceKey: "uuid"});
auction.hasMany(puzzle, { as: "puzzles", foreignKey: "puzzle_auction_uuid", sourceKey: "uuid"});

file.hasMany(art, { as: "arts", foreignKey: "art_file_id"});


user.hasMany(art, { as: "arts", foreignKey: "art_artist_uuid", sourceKey: "uuid"});
user.hasMany(bid, { as: "bids", foreignKey: "bid_user_uuid", sourceKey: "uuid"});
user.hasMany(likes, { as: "likes", foreignKey: "likes_user_uuid", sourceKey: "uuid"});
user.hasMany(paddle, { as: "paddles", foreignKey: "paddle_user_uuid", sourceKey: "uuid"});
user.hasMany(puzzle, { as: "puzzles", foreignKey: "puzzle_user_uuid", sourceKey: "uuid"});

*/

/*
  auction.belongsTo(art, { as: "art_uu", foreignKey: "art_uuid", targetKey: "uuid"});

  paddle.belongsTo(auction, { as: "paddle_auction_uu", foreignKey: "paddle_auction_uuid", targetKey: "uuid"});
  paddle.belongsTo(user, { as: "paddle_user_uu", foreignKey: "paddle_user_uuid", targetKey: "uuid"});

  puzzle.belongsTo(auction, { as: "puzzle_auction_uu", foreignKey: "puzzle_auction_uuid", targetKey: "uuid"});
  puzzle.belongsTo(user, { as: "puzzle_user_uu", foreignKey: "puzzle_user_uuid", targetKey: "uuid"});

  bid.belongsTo(auction, { as: "bid_auction_uu", foreignKey: "bid_auction_uuid", targetKey: "uuid"});
  bid.belongsTo(user, { as: "bid_user_uu", foreignKey: "bid_user_uuid", targetKey: "uuid"});

  likes.belongsTo(auction, { as: "auction_uu", foreignKey: "likes_auction_uuid", targetKey: "uuid"});
  likes.belongsTo(user, { as: "user_uu", foreignKey: "likes_user_uuid", targetKey: "uuid"});
  
  art.belongsTo(file, { as: "art_file", foreignKey: "art_file_id"});
  art.belongsTo(user, { as: "art_artist_uu", foreignKey: "art_artist_uuid", targetKey: "uuid"});
*/