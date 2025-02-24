// backend/models/EstimateRequest.js
const mongoose = require('mongoose');

const estimateRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  projectName: { type: String, required: true },
  productType: { type: String, required: true }, // 부재종류 추가
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EstimateRequest', estimateRequestSchema);
