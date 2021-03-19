const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return invite.init(sequelize, DataTypes);
}

class invite extends Sequelize.Model {
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
    }
  }, {
    sequelize,
    tableName: 'invite',
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
    ]
  });
  return invite;
  }
}
