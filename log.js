// routes //
// 1. ex) router.get("/", userController.함수명); => 함수명은 모델안에서 겹치지 않게 신경쓰기
// 2. routes => 최상위 index.js에 router 꼭 넣기

// sequelize db모듈 못찾을 경우
// npm install --save mariadb

//err 핸들링
// res.status(400).json({
//   msg : ‘something wrong’
// });
