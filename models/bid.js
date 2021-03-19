const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return bid.init(sequelize, DataTypes);
}

class bid extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "아이디"
    },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "uuid",
      unique: "UC_uuid",
      defaultValue: DataTypes.UUIDV4
    },
    user_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "회원 uuid",
      references: {
        model: 'user',
        key: 'uuid'
      }
    },
    auction_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "경매 uuid",
      references: {
        model: 'auction',
        key: 'uuid'
      }
    },
    bid_price: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false,
      comment: "입찰 가격"
    }
  }, {
    sequelize,
    tableName: 'bid',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UC_uuid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uuid" },
        ]
      },
      {
        name: "FK_bid_user_uuid_user_uuid",
        using: "BTREE",
        fields: [
          { name: "user_uuid" },
        ]
      },
      {
        name: "FK_bid_bid_price_auction_uuid",
        using: "BTREE",
        fields: [
          { name: "auction_uuid" },
        ]
      },
    ]
  });
  return bid;
  }
}
