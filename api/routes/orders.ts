import express from 'express';
import db from '../db.js';
import type { MenuItem } from '../db.js';

const router = express.Router();

// 获取菜单项的辅助函数
function getMenuItem(id: number): MenuItem | undefined {
  // 动态导入 db 模块来获取菜单项
  return db.menuItems.find(mi => mi.id === id);
}

const orderListeners: Set<express.Response> = new Set();

router.post('/', (req, res) => {
  const { table_number, items } = req.body;
  
  if (!table_number || !items || items.length === 0) {
    return res.status(400).json({ success: false, error: '缺少必要参数' });
  }

  let totalAmount = 0;
  items.forEach((item: { price: number; quantity: number }) => {
    totalAmount += item.price * item.quantity;
  });

  db.orders.create(table_number, totalAmount, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const orderId = result.lastID;
    let completed = 0;
    
    items.forEach((item: { menu_item_id: number; quantity: number; price: number }) => {
      db.orderItems.create(orderId, item.menu_item_id, item.quantity, item.price, () => {
        completed++;
        if (completed === items.length) {
          res.status(201).json({ success: true, data: { order_id: orderId } });
          notifyOrderUpdate();
        }
      });
    });
  });
});

router.get('/', (req, res) => {
  const { status } = req.query;
  db.orders.all(status as string | undefined, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json({ success: true, data: rows });
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.orders.byId(parseInt(id), (err, order) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!order) {
      return res.status(404).json({ success: false, error: '订单不存在' });
    }

    db.orderItems.byOrderId(parseInt(id), (err, orderItemsData) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      
      const itemsWithDetails = orderItemsData.map(item => {
        const menuItemData = db.menuItems.find(mi => mi.id === item.menu_item_id);
        return {
          ...item,
          name: menuItemData?.name || '',
          image_url: menuItemData?.image_url || '',
        };
      });
      
      res.status(200).json({ success: true, data: { ...order, items: itemsWithDetails } });
    });
  });
});

router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'preparing', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, error: '无效的状态' });
  }

  db.orders.updateStatus(parseInt(id), status, (err, changes) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ success: false, error: '订单不存在' });
    }
    res.status(200).json({ success: true, message: '状态更新成功' });
    notifyOrderUpdate();
  });
});

router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  orderListeners.add(res);

  req.on('close', () => {
    orderListeners.delete(res);
  });

  res.write('data: {"type": "connected"}\n\n');
});

function notifyOrderUpdate() {
  orderListeners.forEach((res) => {
    res.write('data: {"type": "update"}\n\n');
  });
}

export default router;
