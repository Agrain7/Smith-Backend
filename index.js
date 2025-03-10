require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./db');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const estimateRequestRouter = require('./routers/estimateRequest');
const uploadRouter = require('./routers/upload');  
const priceConfigRouter = require('./routers/priceConfig'); 
const ordersRouter = require('./routers/orders'); 
const fs = require('fs');
const path = require('path');

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://smith-web.netlify.app'], // 개발 & 배포 환경 모두 허용
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // 모든 OPTIONS 요청에 대해 CORS 적용

app.use(express.json());

// 정적 파일 서비스: uploads 폴더를 외부에서 접근 가능하도록 설정
app.use('/uploads', express.static('uploads'));

// 라우터 마운트
app.use('/api', authRouter);
app.use('/api', usersRouter);
app.use('/api', estimateRequestRouter);
app.use('/api', uploadRouter);
app.use('/api', priceConfigRouter);
app.use('/api', ordersRouter);

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
