// 모델 불러오기
const userModel = require("../../models").user;

module.exports = {
  // 회원가입
  signup: async (req, res) => {
    const { user_password, user_email, user_nick } = req.body;

    if (!user_password || user_email || user_nick) {
      return res.status(422).send("Unprocessable Entity");
    }

    const [ok, fail] = await userModel.findOrCreate({
      where: {
        user_email: user_email,
      },
      defaults: {
        user_use_currency: "$",
        user_use_language: "kor",
        user_type: "user",
        user_password: user_password,
        user_nick: user_nick,
        wallet_now_deposit: 0,
        wallet_now_coin: 0,
      },
    });
    if (!fail) {
      return res
        .status(409)
        .send(
          "The request that it was sent conflicts with the servers internal operations"
        );
    }
  },
};
