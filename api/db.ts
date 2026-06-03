import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据文件路径
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data.json');

// 确保数据目录存在
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  is_active: boolean;
}

export interface Order {
  id: number;
  table_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
}

interface Database {
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  orderItems: OrderItem[];
  admins: Admin[];
  orderIdCounter: number;
  orderItemIdCounter: number;
}

// 初始数据
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
  admins: [],
  orderIdCounter: 1,
  orderItemIdCounter: 1,
};

// 加载或初始化数据库
let data: Database;

function loadDatabase(): Database {
  try {
    if (fs.existsSync(DB_PATH)) {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      const loadedData = JSON.parse(fileContent);
      // 确保所有字段都存在
      return {
        ...initialData,
        ...loadedData,
        categories: loadedData.categories || initialData.categories,
        menuItems: loadedData.menuItems || initialData.menuItems,
      };
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  return { ...initialData };
}

function saveDatabase(): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// 初始化数据库
data = loadDatabase();

// 如果管理员为空，创建一个默认管理员
if (data.admins.length === 0) {
  const hashedPassword = bcrypt.hashSync('123456', 10);
  data.admins.push({ id: 1, username: 'admin', password: hashedPassword });
}

export const db = {
  categories: {
    all: (callback: (err: null, rows: Category[]) => void) => {
      callback(null, [...data.categories]);
    },
  },
  
  menuItems: {
    all: (callback: (err: null, rows: MenuItem[]) => void) => {
      callback(null, data.menuItems.filter(item => item.is_active));
    },
    byCategory: (categoryId: number, callback: (err: null, rows: MenuItem[]) => void) => {
      callback(null, data.menuItems.filter(item => item.category_id === categoryId && item.is_active));
    },
    byId: (id: number, callback: (err: null, row: MenuItem | undefined) => void) => {
      callback(null, data.menuItems.find(item => item.id === id));
    },
    find: (predicate: (item: MenuItem) => boolean) => {
      return data.menuItems.find(predicate);
    },
  },
  
  orders: {
    all: (status?: string, callback: (err: null, rows: Order[]) => void) => {
      let filtered = [...data.orders];
      if (status) {
        filtered = filtered.filter(order => order.status === status);
      }
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      callback(null, filtered);
    },
    
    byId: (id: number, callback: (err: null, row: Order | undefined) => void) => {
      callback(null, data.orders.find(order => order.id === id));
    },
    
    create: (tableNumber: string, totalAmount: number, callback: (err: null, result: { lastID: number }) => void) => {
      const now = new Date().toISOString();
      const order: Order = {
        id: data.orderIdCounter++,
        table_number: tableNumber,
        total_amount: totalAmount,
        status: 'pending',
        created_at: now,
        updated_at: now,
      };
      data.orders.push(order);
      saveDatabase();
      callback(null, { lastID: order.id });
    },
    
    updateStatus: (id: number, status: string, callback: (err: null, changes: number) => void) => {
      const order = data.orders.find(o => o.id === id);
      if (order) {
        order.status = status as Order['status'];
        order.updated_at = new Date().toISOString();
        saveDatabase();
        callback(null, 1);
      } else {
        callback(null, 0);
      }
    },
  },
  
  orderItems: {
    create: (orderId: number, menuItemId: number, quantity: number, price: number, callback: (err: null) => void) => {
      const orderItem: OrderItem = {
        id: data.orderItemIdCounter++,
        order_id: orderId,
        menu_item_id: menuItemId,
        quantity,
        price,
      };
      data.orderItems.push(orderItem);
      saveDatabase();
      callback(null);
    },
    
    byOrderId: (orderId: number, callback: (err: null, rows: OrderItem[]) => void) => {
      callback(null, data.orderItems.filter(item => item.order_id === orderId));
    },
  },
  
  admin: {
    byUsername: (username: string, callback: (err: null, row: Admin | undefined) => void) => {
      callback(null, data.admins.find(a => a.username === username));
    },
  },
};

export default db;
