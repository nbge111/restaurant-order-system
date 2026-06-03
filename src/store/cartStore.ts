import { create } from 'zustand';
import type { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  tableNumber: string;
  addItem: (item: CartItem) => void;
  removeItem: (menu_item_id: number) => void;
  updateQuantity: (menu_item_id: number, quantity: number) => void;
  clearCart: () => void;
  setTableNumber: (tableNumber: string) => void;
  getTotal: () => number;
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  tableNumber: '',
  
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find(i => i.menu_item_id === item.menu_item_id);
      if (existingItem) {
        return {
          items: state.items.map(i =>
            i.menu_item_id === item.menu_item_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },
  
  removeItem: (menu_item_id) => {
    set((state) => ({
      items: state.items.filter(i => i.menu_item_id !== menu_item_id),
    }));
  },
  
  updateQuantity: (menu_item_id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menu_item_id);
      return;
    }
    set((state) => ({
      items: state.items.map(i =>
        i.menu_item_id === menu_item_id ? { ...i, quantity } : i
      ),
    }));
  },
  
  clearCart: () => set({ items: [] }),
  
  setTableNumber: (tableNumber) => set({ tableNumber }),
  
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  getTotalQuantity: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
