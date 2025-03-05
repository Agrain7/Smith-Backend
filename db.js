// backend/db.js
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,    // Node.js Driver v4 이상부터는 기본값이라 경고가 뜰 수 있음
  useUnifiedTopology: true, // 마찬가지로 경고가 뜰 수 있음
})
.then(() => console.log('MongoDB에 연결되었습니다.'))
.catch((err) => console.error('MongoDB 연결 실패:', err));

module.exports = mongoose;
