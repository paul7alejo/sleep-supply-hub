import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  description?: string;
  maskSeries?: string;
  price: number;
  rrp?: number;
  isEntitlement: boolean;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPaid: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i);
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const updateQuantity = useCallback((id: string, quantity: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)), []);
  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPaid = items.filter(i => !i.isEntitlement).reduce((sum, i) => sum + i.price * i.quantity, 0);

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, totalPaid }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
