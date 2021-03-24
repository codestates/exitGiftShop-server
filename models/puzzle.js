const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return puzzle.init(sequelize, DataTypes);
}

class puzzle extends Sequelize.Model {
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
    puzzle_auction_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "퍼즐 경매 uuid",
      references: {
        model: 'auction',
        key: 'uuid'
      }
    },
    puzzle_user_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "퍼즐 회원 uuid",
      references: {
        model: 'user',
        key: 'uuid'
      }
    },
    puzzle_price: {
      type: DataTypes.DECIMAL(60,5),
      allowNull: false,
      comment: "퍼즐 가격"
    }
  }, {
    sequelize,
    tableName: 'puzzle',
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
        name: "FK_puzzle_puzzle_auction_uuid_auction_uuid",
        using: "BTREE",
        fields: [
          { name: "puzzle_auction_uuid" },
        ]
      },
      {
        name: "FK_puzzle_puzzle_user_uuid_user_uuid",
        using: "BTREE",
        fields: [
          { name: "puzzle_user_uuid" },
        ]
      },
    ]
  });
  return puzzle;
  }
}
