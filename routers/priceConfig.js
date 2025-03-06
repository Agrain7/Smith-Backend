// backend/routers/priceConfig.js
const express = require('express');
const router = express.Router();
const PriceConfig = require('../models/PriceConfig');

// GET /api/price-config : 가격 설정 조회
router.get('/price-config', async (req, res) => {
  try {
    let config = await PriceConfig.findOne({});
    if (!config) {
      config = await PriceConfig.create({});
    }
    res.json({ success: true, config });
  } catch (err) {
    console.error("가격 설정 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

// PUT /api/price-config : 가격 설정 업데이트
router.put('/price-config', async (req, res) => {
  try {
    console.log('PUT /api/price-config req.body:', req.body);
    const { 비규격, 중국산, SM275, SM355, processingFee } = req.body;
    let config = await PriceConfig.findOne({});
    if (!config) {
      config = await PriceConfig.create({ 비규격, 중국산, SM275, SM355, processingFee });
    } else {
      config.비규격 = 비규격;
      config.중국산 = 중국산;
      config.SM275 = SM275;
      config.SM355 = SM355;
      config.processingFee = { ...config.processingFee, ...processingFee };
      await config.save();
    }
    res.json({ success: true, config });
  } catch (err) {
    console.error("가격 설정 업데이트 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

module.exports = router;
