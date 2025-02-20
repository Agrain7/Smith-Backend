// 예시: Node.js 스크립트를 사용해 관리자 계정 생성 (한 번만 실행)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const passwordHash = await bcrypt.hash('dlvlf1234!', 10);
    const adminUser = new User({
      username: 'admin',
      passwordHash,
      name: '관리자',
      phone: '010-0000-0000',
      isAdmin: true,
    });
    await adminUser.save();
    console.log('Admin user created.');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  }); 