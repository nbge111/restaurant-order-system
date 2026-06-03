import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: '用户名和密码不能为空' });
  }

  db.admin.byUsername(username, (err, admin) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!admin) {
      return res.status(401).json({ success: false, error: '用户名或密码错误' });
    }

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!isMatch) {
        return res.status(401).json({ success: false, error: '用户名或密码错误' });
      }

      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });

      res.status(200).json({ success: true, data: { token, username: admin.username } });
    });
  });
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: '未授权' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Token无效' });
    }

    res.status(200).json({ success: true, data: decoded });
  });
});

export default router;
