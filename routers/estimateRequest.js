// backend/routers/estimateRequest.js
const express = require('express');
const router = express.Router();
const EstimateRequest = require('../models/EstimateRequest'); // 새 모델 import

// POST /api/estimate-request 엔드포인트
router.post('/estimate-request', async (req, res) => {
  try {
    // 클라이언트에서 전송된 견적 요청 데이터
    const {
      username,
      name,
      phone,
      email,
      projectName,
      fileContent,
      fileName
    } = req.body;

    // 데이터 유효성 검사 (필요한 경우)
    if (!username || !name || !phone || !email || !projectName || !fileContent || !fileName) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
    }

    // 새로운 견적 요청 생성 및 DB에 저장
    const newEstimateRequest = new EstimateRequest({
      username,
      name,
      phone,
      email,
      projectName,
      fileContent,
      fileName
    });

    await newEstimateRequest.save();

    console.log("견적 요청 데이터 저장됨:", newEstimateRequest);
    res.json({ success: true, message: '견적 요청이 제출되었습니다.' });
  } catch (err) {
    console.error("견적 요청 처리 오류:", err);
    res.status(500).json({ success: false, message: '서버 오류 발생', error: err.message });
  }
});

module.exports = router;
