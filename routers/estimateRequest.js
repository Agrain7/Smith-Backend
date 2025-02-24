// backend/routers/estimateRequest.js
const express = require('express');
const router = express.Router();
const EstimateRequest = require('../models/EstimateRequest');

// POST /api/estimate-request : 견적 요청 데이터 저장
router.post('/estimate-request', async (req, res) => {
  try {
    const { username, name, phone, email, projectName, productType, fileUrl, fileName } = req.body;
    if (!username || !name || !phone || !email || !projectName || !productType || !fileUrl || !fileName) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
    }
    const newEstimateRequest = new EstimateRequest({
      username,
      name,
      phone,
      email,
      projectName,
      productType,  // 추가된 필드
      fileUrl,
      fileName
    });
    await newEstimateRequest.save();
    console.log("견적 요청 데이터 저장됨:", newEstimateRequest);
    res.json({ success: true, message: "견적 요청이 제출되었습니다." });
  } catch (err) {
    console.error("견적 요청 처리 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

// GET /api/estimate-request : 저장된 견적 요청 데이터 반환
router.get('/estimate-request', async (req, res) => {
  try {
    const estimates = await EstimateRequest.find({});
    res.json({ success: true, estimates });
  } catch (err) {
    console.error("견적 요청 데이터 읽기 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

// PUT /api/estimate-request/:id/complete : 견적 요청을 완료 상태로 업데이트
router.put('/estimate-request/:id/complete', async (req, res) => {
  try {
    const estimateId = req.params.id;
    const updated = await EstimateRequest.findByIdAndUpdate(
      estimateId,
      { completed: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "견적 요청을 찾을 수 없습니다." });
    }
    res.json({ success: true, message: "프로젝트가 완료 처리되었습니다.", estimate: updated });
  } catch (err) {
    console.error("프로젝트 완료 처리 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

// DELETE /api/estimate-request/:id : 견적 요청 삭제
router.delete('/estimate-request/:id', async (req, res) => {
  try {
    const estimateId = req.params.id;
    const deleted = await EstimateRequest.findByIdAndDelete(estimateId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "견적 요청을 찾을 수 없습니다." });
    }
    res.json({ success: true, message: "견적 요청이 삭제되었습니다." });
  } catch (err) {
    console.error("견적 요청 삭제 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

module.exports = router;
