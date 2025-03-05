// backend/models/PriceConfig.js
const mongoose = require('mongoose');

const priceConfigSchema = new mongoose.Schema({
  sm275: { type: Number, default: 1000 },
  sm355: { type: Number, default: 1200 },
  processingFee: {
    현장용소부재: { type: Number, default: 199 },
    공장용소부재: { type: Number, default: 188 },
    브라켓: { type: Number, default: 177 },
  }
}, { timestamps: true });

module.exports = mongoose.model('PriceConfig', priceConfigSchema);
