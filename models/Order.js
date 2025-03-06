// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  productName: { type: String, required: true },
  projectName: { type: String, required: true },
  status: { type: String, default: "견적 전송 완료" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
