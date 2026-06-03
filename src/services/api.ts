import type { MenuItem, Category, Order } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  menu: {
    getAll: async (): Promise<MenuItem[]> => {
      const res = await fetch(`${API_BASE}/menu`);
      const data = await res.json();
      return data.data;
    },
    
    getCategories: async (): Promise<Category[]> => {
      const res = await fetch(`${API_BASE}/menu/categories`);
      const data = await res.json();
      return data.data;
    },
    
    getByCategory: async (categoryId: number): Promise<MenuItem[]> => {
      const res = await fetch(`${API_BASE}/menu/category/${categoryId}`);
      const data = await res.json();
      return data.data;
    },
    
    getById: async (id: number): Promise<MenuItem> => {
      const res = await fetch(`${API_BASE}/menu/${id}`);
      const data = await res.json();
      return data.data;
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
      return data.data;
    },
    
    getAll: async (status?: string): Promise<Order[]> => {
      const url = status ? `${API_BASE}/orders?status=${status}` : `${API_BASE}/orders`;
      const res = await fetch(url);
      const data = await res.json();
      return data.data;
    },
    
    getById: async (id: number): Promise<Order> => {
      const res = await fetch(`${API_BASE}/orders/${id}`);
      const data = await res.json();
      return data.data;
    },
    
    updateStatus: async (id: number, status: string, token: string): Promise<void> => {
      await fetch(`${API_BASE}/orders/${id}/status`, {
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
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
    
    verify: async (token: string): Promise<boolean> => {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return res.ok;
    },
  },
};
