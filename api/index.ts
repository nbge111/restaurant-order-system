import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  is_active: boolean;
}

interface Order {
  id: number;
  table_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
}

interface Database {
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  orderItems: OrderItem[];
  orderIdCounter: number;
  orderItemIdCounter: number;
}

const initialData: Database = {
  categories: [
    { id: 1, name: '招牌菜', description: '本店招牌特色菜品' },
    { id: 2, name: '主食', description: '米饭、面条等主食' },
    { id: 3, name: '热菜', description: '各种热炒菜品' },
    { id: 4, name: '凉菜', description: '清爽开胃凉菜' },
    { id: 5, name: '汤品', description: '营养美味汤品' },
    { id: 6, name: '饮品', description: '各种饮料' },
  ],
  menuItems: [
    { id: 1, name: '红烧肉', description: '精选五花肉，慢炖入味', price: 38.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20braised%20pork%20belly%20hong%20shao%20rou%20on%20white%20plate%20food%20photography&image_size=square', category_id: 1, is_active: true },
    { id: 2, name: '宫保鸡丁', description: '鸡肉嫩滑，花生酥脆', price: 32.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Kung%20Pao%20chicken%20with%20peanuts%20Chinese%20food%20on%20plate%20food%20photography&image_size=square', category_id: 3, is_active: true },
    { id: 3, name: '鱼香肉丝', description: '酸甜微辣，下饭神器', price: 28.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Yu%20Xiang%20Shredded%20Pork%20Chinese%20food%20on%20plate%20food%20photography&image_size=square', category_id: 3, is_active: true },
    { id: 4, name: '麻婆豆腐', description: '麻辣鲜香，经典川菜', price: 22.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Mapo%20tofu%20Sichuan%20style%20spicy%20Chinese%20food%20on%20plate%20food%20photography&image_size=square', category_id: 3, is_active: true },
    { id: 5, name: '清蒸鲈鱼', description: '鲜嫩爽滑，原汁原味', price: 48.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Steamed%20sea%20bass%20Chinese%20style%20whole%20fish%20on%20plate%20food%20photography&image_size=square', category_id: 3, is_active: true },
    { id: 6, name: '蒜蓉西兰花', description: '清淡营养，健康之选', price: 18.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Garlic%20broccoli%20Chinese%20vegetable%20dish%20on%20plate%20food%20photography&image_size=square', category_id: 3, is_active: true },
    { id: 7, name: '凉拌黄瓜', description: '清爽开胃，夏日必备', price: 12.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20cold%20cucumber%20salad%20appetizer%20on%20plate%20food%20photography&image_size=square', category_id: 4, is_active: true },
    { id: 8, name: '拍黄瓜', description: '简单美味，清脆爽口', price: 10.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Smashed%20cucumber%20salad%20Chinese%20style%20on%20plate%20food%20photography&image_size=square', category_id: 4, is_active: true },
    { id: 9, name: '西红柿鸡蛋汤', description: '家常味道，暖心暖胃', price: 15.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Tomato%20egg%20soup%20Chinese%20style%20in%20bowl%20food%20photography&image_size=square', category_id: 5, is_active: true },
    { id: 10, name: '酸辣汤', description: '酸辣开胃，驱寒暖身', price: 16.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hot%20and%20sour%20soup%20Chinese%20style%20in%20bowl%20food%20photography&image_size=square', category_id: 5, is_active: true },
    { id: 11, name: '蛋炒饭', description: '粒粒分明，蛋香浓郁', price: 18.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Egg%20fried%20rice%20Chinese%20style%20on%20plate%20food%20photography&image_size=square', category_id: 2, is_active: true },
    { id: 12, name: '牛肉面', description: '牛肉软烂，汤鲜味美', price: 26.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Beef%20noodle%20soup%20Chinese%20style%20in%20bowl%20food%20photography&image_size=square', category_id: 2, is_active: true },
    { id: 13, name: '可乐', description: '冰爽可口，解渴必备', price: 8.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Cola%20drink%20in%20glass%20with%20ice%20cubes%20product%20photography&image_size=square', category_id: 6, is_active: true },
    { id: 14, name: '雪碧', description: '清爽柠檬味，气泡十足', price: 8.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Sprite%20lemon%20lime%20soda%20in%20glass%20with%20ice%20product%20photography&image_size=square', category_id: 6, is_active: true },
    { id: 15, name: '王老吉', description: '凉茶饮品，清热降火', price: 6.00, image_url: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Wanglaoji%20herbal%20tea%20drink%20in%20red%20can%20product%20photography&image_size=square', category_id: 6, is_active: true },
  ],
  orders: [],
  orderItems: [],
  orderIdCounter: 1,
  orderItemIdCounter: 1,
};

const store = new Map<string, string>();

function generateToken(username: string): string {
  const payload = {
    username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token: string): { username: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp && payload.exp > Date.now() / 1000) {
      return payload;
    }
  } catch {
    return null;
  }
  return null;
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function getDatabase(): Database {
  const stored = store.get('restaurant-db');
  if (stored) {
    return { ...initialData, ...JSON.parse(stored) };
  }
  return { ...initialData };
}

function saveDatabase(data: Database): void {
  store.set('restaurant-db', JSON.stringify(data));
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getDatabase();
  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  if (pathname === '/api/categories') {
    return res.status(200).json(db.categories);
  }

  if (pathname === '/api/menu') {
    const categoryId = req.query.category_id;
    let items = db.menuItems.filter(item => item.is_active);
    if (categoryId) {
      items = items.filter(item => item.category_id === parseInt(categoryId as string));
    }
    return res.status(200).json(items);
  }

  if (pathname === '/api/auth/login') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { username, password } = req.body;
    if (username === 'admin' && bcrypt.compareSync(password, '$2b$10$ld5SN8l5qg.WJaUflBMof.o.MtPSS2hvB5CLAb6RoifiDe7N5MAvy')) {
      const token = generateToken(username);
      return res.status(200).json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: '用户名或密码错误' });
  }

  if (pathname === '/api/auth/verify') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const payload = token ? verifyToken(token) : null;
    if (payload) {
      return res.status(200).json({ success: true, username: payload.username });
    }
    return res.status(401).json({ success: false });
  }

  if (pathname === '/api/orders') {
    if (req.method === 'GET') {
      const status = req.query.status;
      let orders = [...db.orders];
      if (status) {
        orders = orders.filter(order => order.status === status);
      }
      orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const { table_number, items } = req.body;
      const now = new Date().toISOString();
      const order: Order = {
        id: db.orderIdCounter++,
        table_number,
        total_amount: items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0),
        status: 'pending',
        created_at: now,
        updated_at: now,
      };
      db.orders.push(order);
      
      items.forEach((item: { menu_item_id: number; quantity: number; price: number }) => {
        const orderItem: OrderItem = {
          id: db.orderItemIdCounter++,
          order_id: order.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price,
        };
        db.orderItems.push(orderItem);
      });

      saveDatabase(db);
      return res.status(200).json({ success: true, order_id: order.id });
    }
  }

  if (pathname.startsWith('/api/orders/')) {
    const orderId = parseInt(pathname.split('/')[3]);
    if (req.method === 'GET') {
      const order = db.orders.find(o => o.id === orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      const orderItems = db.orderItems.filter(item => item.order_id === orderId);
      const itemsWithDetails = orderItems.map(item => {
        const menuItem = db.menuItems.find(mi => mi.id === item.menu_item_id);
        return {
          ...item,
          name: menuItem?.name || '',
          image_url: menuItem?.image_url || '',
        };
      });
      return res.status(200).json({ ...order, items: itemsWithDetails });
    }

    if (req.method === 'PUT') {
      const { status } = req.body;
      const order = db.orders.find(o => o.id === orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      order.status = status as Order['status'];
      order.updated_at = new Date().toISOString();
      saveDatabase(db);
      return res.status(200).json({ success: true });
    }
  }

  if (pathname === '/api/health') {
    return res.status(200).json({ status: 'ok' });
  }

  return res.status(404).json({ error: 'Not found' });
}
