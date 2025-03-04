const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const router = express.Router();
const path = require('path');

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

  // 파일명을 인코딩하여 안전하게 처리 (한글 등의 문자 문제 방지)
  const safeFileName = encodeURIComponent(req.file.originalname);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,  // 예: 'smithappbucket'
    Key: `${Date.now()}-${safeFileName}`, // 인코딩된 파일명 포함
    Body: req.file.buffer,
    // ACL 옵션 제거 (버킷의 Block Public Access 정책에 따라)
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("S3 업로드 오류:", err);
      return res.status(500).json({ success: false, message: '파일 업로드 실패', error: err.message });
    }
    console.log("파일 업로드 성공:", data);
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
