require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./db');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const estimateRequestRouter = require('./routers/estimateRequest');
const uploadRouter = require('./routers/upload');  // 추가된 라우터
const priceConfigRouter = require('./routers/priceConfig'); // 추가된 라우터
const fs = require('fs');
const path = require('path');

const app = express();

// CORS 옵션 설정: 개발 중에는 http://localhost:5173, 배포 후에는 실제 프론트엔드 도메인으로 변경
const corsOptions = {
  origin: 'http://localhost:5173', // 허용할 프론트엔드 도메인
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // 필요 시 쿠키 등 자격 증명 허용
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// 정적 파일 서비스: uploads 폴더를 외부에서 접근 가능하도록 설정
app.use('/uploads', express.static('uploads'));

// 라우터 마운트
app.use('/api', authRouter);
app.use('/api', usersRouter);
app.use('/api', estimateRequestRouter);
app.use('/api', uploadRouter);
app.use('/api', priceConfigRouter);

app.get('/', (req, res) => {
  res.send('Hello from Express backend with MongoDB!');
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('uploads 폴더가 생성되었습니다.');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
