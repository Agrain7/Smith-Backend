// backend/models/EstimateRequest.js
const mongoose = require('mongoose');

const estimateRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  projectName: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // 업로드된 파일의 URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EstimateRequest', estimateRequestSchema);
