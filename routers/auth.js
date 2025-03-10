// backend/routers/auth.js
const express = require('express');
const bcrypt = require('bcryptjs'); // bcryptjs 사용
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
// JWT 인증 미들웨어
const authMiddleware = require('../middleware/authMiddleware');

// 로그인 API (POST /api/login)
router.post('/login', async (req, res) => {
  console.log('로그인 요청 받음:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('사용자 없음');
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('비밀번호 불일치');
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성 (payload에 username 포함)
    const token = jwt.sign(
      { username: user.username, name: user.name, phone: user.phone, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'mySuperSecretKey123!',
      { expiresIn: '1h' }
    );
    console.log('로그인 성공, 토큰 생성됨');
    res.json({ message: '로그인 성공', token });
  } catch (err) {
    console.error("로그인 에러:", err.message, err.stack);
    res.status(500).json({ message: '서버 오류 발생', error: err.message });
  }
});

// 회원가입 API (POST /api/signup)
router.post('/signup', async (req, res) => {
  console.log('Signup 요청 받음');
  const { username, password, name, phone, email } = req.body;

  if (!username || !password || !name || !phone || !email) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      passwordHash,
      name,
      phone,
      email 
    });

    await newUser.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error("회원가입 에러:", err.message, err.stack);
    res.status(500).json({ message: '서버 오류 발생', error: err.message });
  }
});

// 보호된 회원 전용 API 예시 (GET /api/profile)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: '회원 전용 정보입니다.', user: req.user });
});

module.exports = router;
