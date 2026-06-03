import type { MenuItem, Category, Order } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  menu: {
    getAll: async (): Promise<MenuItem[]> => {
      const res = await fetch(`${API_BASE}/menu`);
      return await res.json();
    },
    
    getCategories: async (): Promise<Category[]> => {
      const res = await fetch(`${API_BASE}/categories`);
      return await res.json();
    },
    
    getByCategory: async (categoryId: number): Promise<MenuItem[]> => {
      const res = await fetch(`${API_BASE}/menu?category_id=${categoryId}`);
      return await res.json();
    },
    
    getById: async (id: number): Promise<MenuItem> => {
      const res = await fetch(`${API_BASE}/menu`);
      const items = await res.json();
      return items.find((item: MenuItem) => item.id === id);
    },
  },
  
  orders: {
    create: async (tableNumber: string, items: { menu_item_id: number; quantity: number; price: number }[]): Promise<{ order_id: number }> => {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: tableNumber, items }),
      });
      const data = await res.json();
      return { order_id: data.order_id };
    },
    
    getAll: async (status?: string): Promise<Order[]> => {
      const url = status ? `${API_BASE}/orders?status=${status}` : `${API_BASE}/orders`;
      const res = await fetch(url);
      return await res.json();
    },
    
    getById: async (id: number): Promise<Order> => {
      const res = await fetch(`${API_BASE}/orders/${id}`);
      return await res.json();
    },
    
    updateStatus: async (id: number, status: string, token: string): Promise<void> => {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    },
  },
  
  auth: {
    login: async (username: string, password: string): Promise<{ token: string; username: string }> => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || '登录失败');
      return { token: data.token, username: username };
    },
    
    verify: async (token: string): Promise<boolean> => {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      return data.success;
    },
  },
};
