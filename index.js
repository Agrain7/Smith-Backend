// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./db');  // db.js를 통해 MongoDB 연결
const authRouter = require('./routers/auth');  // 라우터 불러오기

const app = express();
app.use(cors());
app.use(express.json());

// auth 라우터를 /api 경로에 마운트
app.use('/api', authRouter);

// 테스트용 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello from Express backend with MongoDB!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
