// backend/routers/upload.js
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

/**
 * 프로젝트명을 안전한 파일명으로 변환하는 함수
 * - 앞뒤 공백 제거 후, 내부 공백은 밑줄(_)로 변환
 * - 영문, 숫자, 한글, 밑줄(_), 대시(-)만 허용
 * - 최대 길이는 50자로 제한
 */
function sanitizeFileName(name) {
  if (!name) return 'default';
  let sanitized = name.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_\-가-힣]/g, '');
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }
  return sanitized;
}

// POST /api/upload-estimate : 파일 업로드 처리 (S3로 업로드)
router.post('/upload-estimate', upload.single('estimateFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다.' });
  }

  // 요청 바디에서 사용자가 입력한 프로젝트명 가져오기 (없으면 'default' 사용)
  const projectName = req.body.projectName || 'default';
  // 프로젝트명을 안전한 파일명으로 치환
  const safeProjectName = sanitizeFileName(projectName);

  // 파일 확장자 추출
  const ext = path.extname(req.file.originalname);

  // 파일명을 타임스탬프와 치환된 프로젝트명으로 생성
  const fileKey = `${Date.now()}-${safeProjectName}${ext}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,  // 예: 'smithappbucket'
    Key: fileKey, // 안전하게 치환된 파일명 사용
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("S3 업로드 오류:", err);
      return res.status(500).json({ success: false, message: '파일 업로드 실패', error: err.message });
    }
    console.log("파일 업로드 성공:", data);
    // S3에 저장된 파일의 URL과 안전하게 생성된 파일명을 반환
    res.json({ success: true, message: '파일 업로드 성공', fileUrl: data.Location, fileName: fileKey });
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
