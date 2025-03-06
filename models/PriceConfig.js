// backend/models/PriceConfig.js
const mongoose = require('mongoose');

const priceConfigSchema = new mongoose.Schema({
  비규격: {
    "9t이하": { type: Number, default: 800 },
    "12~50t": { type: Number, default: 1000 }
  },
  중국산: {
    "9t이하": { type: Number, default: 900 },
    "12~50t": { type: Number, default: 1100 }
  },
  SM275: {
    "9t이하": { type: Number, default: 1000 },
    "12~50t": { type: Number, default: 1200 }
  },
  SM355: {
    "9t이하": { type: Number, default: 1100 },
    "12~50t": { type: Number, default: 1300 }
  },
  processingFee: {
    "스플라이스 철판": { type: Number, default: 180 },
    "일반 철판": { type: Number, default: 160 }
  }
}, { timestamps: true });

module.exports = mongoose.model('PriceConfig', priceConfigSchema);
