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

// PUT /api/orders/:id/status : 주문 상태 업데이트
router.put('/orders/:id/status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: '상태 값이 필요합니다.' });
    }
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("주문 상태 업데이트 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생", error: err.message });
  }
});

module.exports = router;
