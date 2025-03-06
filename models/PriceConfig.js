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
    현장용소부재: { type: Number, default: 199 },
    공장용소부재: { type: Number, default: 188 },
    브라켓: { type: Number, default: 177 }
  }
}, { timestamps: true });

module.exports = mongoose.model('PriceConfig', priceConfigSchema);
