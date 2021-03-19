const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "아이디",
      },
      uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        comment: "uuid",
        unique: "UC_uuid",
        defaultValue: DataTypes.UUIDV4,
      },
      user_use_currency: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "회원 사용 화폐",
      },
      user_use_language: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "회원 사용 언어",
      },
      user_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "회원(user),관리자(admin),작가(artist),게스트(guest)",
      },
      user_password: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "암호화 시킬거임",
      },
      user_email: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "계정 아이디 역할",
      },
      user_nick: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "회원 닉네임",
      },
      wallet_now_deposit: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
        comment: "지갑 현재 잔고",
      },
      wallet_now_coin: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
        comment: "지갑 현재 코인",
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "UC_uuid",
          unique: true,
          using: "BTREE",
          fields: [{ name: "uuid" }],
        },
      ],
    }
  );
};
