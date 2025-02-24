// backend/routers/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 파일 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // uploads 폴더에 저장
  },
  filename: function (req, file, cb) {
    // 파일명 깨짐 방지를 위해 원본 파일명을 latin1 -> UTF-8로 변환 시도
    let originalName = file.originalname;
    try {
      originalName = Buffer.from(originalName, 'latin1').toString('utf8');
    } catch (error) {
      console.error("파일명 인코딩 변환 오류:", error);
    }
    cb(null, Date.now() + '-' + originalName);
  }
});

// 모든 파일 타입 업로드 허용 (fileFilter 옵션 제거)
const upload = multer({ storage: storage });

// POST /api/upload-estimate : 파일 업로드 처리
router.post('/upload-estimate', (req, res) => {
  upload.single('estimateFile')(req, res, function(err) {
    if (err) {
      console.error("Multer 오류:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다.' });
    }
    // 업로드된 파일의 URL 생성
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, message: '파일 업로드 성공', fileUrl, fileName: req.file.originalname });
  });
});

module.exports = router;
