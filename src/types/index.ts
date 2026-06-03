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

export interface CartItem {
  menu_item_id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  name: string;
  image_url: string;
}

export interface Order {
  id: number;
  table_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Admin {
  id: number;
  username: string;
}
