// backend/routers/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders?username=사용자아이디
router.get('/orders', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ success: false, message: 'username 쿼리 파라미터가 필요합니다.' });
    }
    // username에 해당하는 주문 데이터 조회
    const orders = await Order.find({ username });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("주문 데이터 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

// POST /api/orders : 새로운 주문 생성
router.post('/orders', async (req, res) => {
  try {
    const { username, productName, projectName, status } = req.body;
    if (!username || !productName || !projectName) {
      return res.status(400).json({ success: false, message: '필수 필드 누락' });
    }
    const newOrder = new Order({ username, productName, projectName, status });
    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("주문 생성 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

module.exports = router;
