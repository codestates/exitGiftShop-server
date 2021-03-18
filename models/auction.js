const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auction', {
    art_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "작품 uuid",
      references: {
        model: 'art',
        key: 'uuid'
      }
    },
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
      unique: "UC_uuid"
    },
    auction_end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "경매 종료 시간"
    },
    auction_hammer_price: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true,
      comment: "경매 낙찰 가격"
    },
    auction_now_price: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false,
      comment: "경매 현재 가격"
    },
    auction_link: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "경매 링크"
    },
    auction_start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "경매 시작 시간"
    }
  }, {
    sequelize,
    tableName: 'auction',
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
        name: "FK_auction_art_uuid_art_uuid",
        using: "BTREE",
        fields: [
          { name: "art_uuid" },
        ]
      },
    ]
  });
};
