import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  db.menuItems.all((err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json({ success: true, data: rows });
    }
  });
});

router.get('/categories', (req, res) => {
  db.categories.all((err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json({ success: true, data: rows });
    }
  });
});

router.get('/category/:id', (req, res) => {
  const { id } = req.params;
  db.menuItems.byCategory(parseInt(id), (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json({ success: true, data: rows });
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.menuItems.byId(parseInt(id), (err, row) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else if (!row) {
      res.status(404).json({ success: false, error: '菜品不存在' });
    } else {
      res.status(200).json({ success: true, data: row });
    }
  });
});

export default router;
