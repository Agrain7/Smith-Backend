// backend/routers/estimateRequest.js
const express = require('express');
const router = express.Router();
const EstimateRequest = require('../models/EstimateRequest');
const AWS = require('aws-sdk');

// AWS S3 설정 (이미 환경 변수로 설정되어 있다고 가정)
const s3 = new AWS.S3();

// POST /api/estimate-request : 견적 요청 데이터 저장
router.post('/estimate-request', async (req, res) => {
  try {
    // 이메일 필드를 완전히 제거하였으므로, 나머지 필드만 검증합니다.
    const { username, name, phone, projectName, productType, fileUrl, fileName } = req.body;
    if (!username || !name || !phone || !projectName || !productType || !fileUrl || !fileName) {
      return res.status(400).json({ success: false, message: '필수 필드를 모두 입력해주세요.' });
    }

    const newEstimateRequest = new EstimateRequest({
      username,
      name,
      phone,
      projectName,
      productType, 
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

// DELETE /api/estimate-request/:id : 견적 요청 삭제 (DB와 S3 파일 모두 삭제)
router.delete('/estimate-request/:id', async (req, res) => {
  try {
    const estimateId = req.params.id;
    // 삭제할 견적 요청을 조회합니다.
    const estimate = await EstimateRequest.findById(estimateId);
    if (!estimate) {
      return res.status(404).json({ success: false, message: "견적 요청을 찾을 수 없습니다." });
    }

    // S3에서 파일 삭제 처리
    const fileUrl = estimate.fileUrl;
    // 파일 Key는 fileUrl의 마지막 부분(인코딩된 상태)입니다.
    const fileKey = fileUrl.split('/').pop();
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
    };

    // Promise를 사용하여 S3 파일 삭제. 실패해도 계속 진행합니다.
    await s3.deleteObject(s3Params).promise().catch(err => {
      console.error("S3 파일 삭제 오류:", err);
      // S3 삭제 실패 시, 로그만 남기고 계속 진행
    });

    // DB에서 견적 요청 삭제
    const deleted = await EstimateRequest.findByIdAndDelete(estimateId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "견적 요청을 찾을 수 없습니다." });
    }
    res.json({ success: true, message: "견적 요청과 관련 파일이 삭제되었습니다." });
  } catch (err) {
    console.error("견적 요청 삭제 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

module.exports = router;
