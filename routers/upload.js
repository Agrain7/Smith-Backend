// backend/routers/upload.js
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const router = express.Router();

// AWS S3 설정 (환경 변수나 config 파일로 관리)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,  // 예: 'ap-northeast-2'
});
const s3 = new AWS.S3();

// multer를 메모리 저장소로 설정 (파일을 로컬에 저장하지 않고 메모리에서 바로 S3로 전송)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/upload-estimate : 파일 업로드 처리 (S3로 업로드)
router.post('/upload-estimate', upload.single('estimateFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다.' });
  }

  // S3 업로드 옵션
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,  // .env 파일에 설정 (예: 'my-s3-bucket')
    Key: Date.now() + '-' + req.file.originalname, // 파일 이름
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  // S3에 업로드
  s3.upload(params, (err, data) => {
    if (err) {
      console.error("S3 업로드 오류:", err);
      return res.status(500).json({ success: false, message: '파일 업로드 실패', error: err });
    }
    // 업로드된 파일의 URL
    res.json({ success: true, message: '파일 업로드 성공', fileUrl: data.Location, fileName: req.file.originalname });
  });
});

// GET /api/download/:key : S3 파일 다운로드 (원하면 프록시 방식으로 처리 가능)
router.get('/download/:key', (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: req.params.key,
  };

  // S3에서 파일을 스트리밍 방식으로 전송 (강제 다운로드 헤더 설정)
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(req.params.key)}`);
  res.setHeader('Content-Type', 'application/octet-stream');

  const fileStream = s3.getObject(params).createReadStream();
  fileStream.on('error', function(err) {
    console.error("파일 다운로드 오류:", err);
    res.status(500).end();
  });
  fileStream.pipe(res);
});

module.exports = router;
