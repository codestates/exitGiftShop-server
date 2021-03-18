const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('likes', {
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
    }
  }, {
    sequelize,
    tableName: 'likes',
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
        name: "FK_like_user_uuid_user_uuid",
        using: "BTREE",
        fields: [
          { name: "user_uuid" },
        ]
      },
      {
        name: "FK_like_auction_uuid_auction_uuid",
        using: "BTREE",
        fields: [
          { name: "auction_uuid" },
        ]
      },
    ]
  });
};
