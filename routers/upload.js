// backend/routers/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 파일 저장 위치 및 파일명 설정 (예: uploads 폴더에 저장)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // uploads 폴더가 프로젝트 루트에 있어야 합니다.
  },
  filename: function (req, file, cb) {
    // 파일명 중복을 피하기 위해 현재 시간 추가
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  // 필터: txt 파일만 허용 (필요하면 확장자를 변경 가능)
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('TXT 파일만 업로드할 수 있습니다.'), false);
    }
  }
});

// POST /api/upload-estimate : 파일 업로드 처리
router.post('/upload-estimate', upload.single('estimateFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다.' });
  }
  // 업로드된 파일 정보 반환 (관리자가 나중에 다운로드 받을 수 있는 URL 제공)
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, message: '파일 업로드 성공', fileUrl, fileName: req.file.originalname });
});

module.exports = router;
