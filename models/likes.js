const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return likes.init(sequelize, DataTypes);
}

class likes extends Sequelize.Model {
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
    likes_user_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "회원 uuid",
      references: {
        model: 'user',
        key: 'uuid'
      }
    },
    likes_auction_uuid: {
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
          { name: "likes_user_uuid" },
        ]
      },
      {
        name: "FK_likes_likes_auction_uuid_auction_uuid",
        using: "BTREE",
        fields: [
          { name: "likes_auction_uuid" },
        ]
      },
    ]
  });
  return likes;
  }
}
