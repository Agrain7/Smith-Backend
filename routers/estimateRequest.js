// backend/routers/estimateRequest.js
const express = require('express');
const router = express.Router();

// POST /api/estimate-request 엔드포인트
router.post('/estimate-request', async (req, res) => {
  try {
    // 클라이언트로부터 받은 견적 요청 데이터
    const estimateData = req.body;
    console.log("견적 요청 데이터:", estimateData);

    // 여기에 데이터베이스 저장 등의 로직을 추가할 수 있습니다.
    // 예를 들어, 새로운 EstimateRequest 모델을 만들어 저장하는 코드 등

    res.json({ success: true, message: "견적 요청이 제출되었습니다." });
  } catch (err) {
    console.error("견적 요청 처리 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

module.exports = router;
