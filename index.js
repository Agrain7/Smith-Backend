// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./db');  
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users'); // 추가된 users 라우터

const app = express();
app.use(cors());
app.use(express.json());

// auth 라우터와 users 라우터를 /api 경로에 마운트
app.use('/api', authRouter);
app.use('/api', usersRouter);

// 기본 테스트 라우트
app.get('/', (req, res) => {
  res.send('Hello from Express backend with MongoDB!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
