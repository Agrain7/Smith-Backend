// backend/routers/priceConfig.js
const express = require('express');
const router = express.Router();
const PriceConfig = require('../models/PriceConfig');

// GET /api/price-config : 가격 설정 조회
router.get('/price-config', async (req, res) => {
  try {
    let config = await PriceConfig.findOne({});
    // 만약 저장된 설정이 없다면 기본값을 생성
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
    const { sm275, sm355, processingFee } = req.body;
    let config = await PriceConfig.findOne({});
    if (!config) {
      config = await PriceConfig.create({ sm275, sm355, processingFee });
    } else {
      config.sm275 = sm275;
      config.sm355 = sm355;
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
