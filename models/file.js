const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('file', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "아이디"
    },
    file_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "파일 이름"
    },
    file_data: {
      type: DataTypes.BLOB,
      allowNull: false,
      comment: "파일 데이터"
    }
  }, {
    sequelize,
    tableName: 'file',
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
        name: "UC_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
