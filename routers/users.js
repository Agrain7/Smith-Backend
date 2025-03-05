// backend/routers/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// 관리자 전용으로 모든 사용자 목록 반환 (관리자 인증 미들웨어 적용)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    // 예시: 모든 사용자 정보를 가져오되, 민감한 정보는 제외
    const users = await User.find({}, { passwordHash: 0 });
    res.json({ users });
  } catch (err) {
    console.error("회원 정보 불러오기 오류:", err);
    res.status(500).json({ message: '서버 오류 발생', error: err.message });
  }
});

// 관리자 전용: 특정 사용자 삭제 (DELETE /api/users/:id)
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json({ message: '사용자가 삭제되었습니다.' });
  } catch (err) {
    console.error("사용자 삭제 오류:", err);
    res.status(500).json({ message: '서버 오류 발생', error: err.message });
  }
});

module.exports = router;
