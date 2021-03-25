const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return paddle.init(sequelize, DataTypes);
}

class paddle extends Sequelize.Model {
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
    paddle_auction_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "패들 작품 uuid",
      references: {
        model: 'auction',
        key: 'uuid'
      }
    },
    paddle_user_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "패들 회원 uuid",
      references: {
        model: 'user',
        key: 'uuid'
      }
    },
    paddle_price: {
      type: DataTypes.DECIMAL(60,5),
      allowNull: false,
      comment: "패들 가격"
    }
  }, {
    sequelize,
    tableName: 'paddle',
    timestamps: true,
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
        name: "FK_paddle_paddle_auction_uuid_auction_uuid",
        using: "BTREE",
        fields: [
          { name: "paddle_auction_uuid" },
        ]
      },
      {
        name: "FK_paddle_paddle_user_uuid_user_uuid",
        using: "BTREE",
        fields: [
          { name: "paddle_user_uuid" },
        ]
      },
    ]
  });
  return paddle;
  }
}
