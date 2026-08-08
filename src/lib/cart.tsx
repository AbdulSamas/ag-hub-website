import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product, CartItem } from '@/lib/supabase';
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/profile";
import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart as clearCartDb,
} from "@/lib/cartDb";
type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const loadUser = useCallback(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    setUserId(user.id);
  } else {
    setUserId(null);
  }

  setLoading(false);
}, []);
const loadCart = useCallback(async () => {
  if (!userId) return;

  const { data, error } = await getCart(userId);

  if (error) {
    console.error(error);
    return;
  }

  console.log("Database Cart:", data);

  const cartItems =
    data?.map((item: any) => ({
      product: item.product,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    })) || [];

  setItems(cartItems);
}, [userId]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  useEffect(() => {
  loadUser();
}, [loadUser]);
useEffect(() => {
  loadCart();
}, [loadCart]);

  const addToCart = useCallback(
  async (product: Product, size?: string, color?: string, quantity = 1) => {
      const sz = size || (product.sizes.length > 0 ? product.sizes[0] : 'One Size');
      const cl = color || (product.colors.length > 0 ? product.colors[0] : 'Default');
     if (userId) {
  if (userId) {
  const { data, error } = await addCartItem({
    user_id: userId,
    product_id: product.id,
    quantity,
    size: sz,
    color: cl,
  });

  console.log("INSERT DATA:", data);
  console.log("INSERT ERROR:", error);
}

  console.log("Saved to Supabase");
}
      setItems((prev) => {
        const existing = prev.findIndex(
          (item) => item.product.id === product.id && item.size === sz && item.color === cl,
        );
        if (existing >= 0) {
          const next = [...prev];
          next[existing].quantity += quantity;
          return next;
        }
        return [...prev, { product, size: sz, color: cl, quantity }];
      });
      setIsOpen(true);
   },
[userId],
);

  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        count,
        subtotal,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
