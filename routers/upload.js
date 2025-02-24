// backend/routers/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 파일 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 파일명을 정규화하고 안전한 문자만 남기도록 처리
    const safeName = file.originalname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "") // 악센트 제거
      .replace(/[^a-zA-Z0-9.\-_]/g, ""); // 알파벳, 숫자, 점, 대시, 밑줄만 허용
    cb(null, Date.now() + '-' + safeName);
  }
});

// 모든 파일 업로드 허용: fileFilter 옵션을 제거합니다.
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
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, message: '파일 업로드 성공', fileUrl, fileName: req.file.originalname });
  });
});

module.exports = router;
