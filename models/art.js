const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return art.init(sequelize, DataTypes);
}

class art extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    art_file_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "작품 파일 아이디",
      references: {
        model: 'file',
        key: 'id'
      }
    },
    art_artist_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      comment: "작품 작가 uuid",
      references: {
        model: 'user',
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
      unique: "UC_uuid",
      defaultValue: DataTypes.UUIDV4
    },
    art_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "작품 제목"
    },
    art_desc: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "작품 설명"
    },
    art_twitter: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "작품 트위터"
    }
  }, {
    sequelize,
    tableName: 'art',
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
        name: "FK_art_art_artist_uuid_user_uuid",
        using: "BTREE",
        fields: [
          { name: "art_artist_uuid" },
        ]
      },
      {
        name: "FK_art_art_file_id_file_id",
        using: "BTREE",
        fields: [
          { name: "art_file_id" },
        ]
      },
    ]
  });
  return art;
  }
}
