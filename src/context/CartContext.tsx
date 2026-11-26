import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import type { RentalItem } from "../constants/types";

export type CartItem = {
  id: string;
  item: RentalItem;
  categoryName: string;
  durationDays: number;
  totalPrice: number;
  addedAt: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: RentalItem, categoryName: string, durationDays: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "@sewakuy_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      }
    } catch (e) {
      console.warn("Gagal memuat keranjang:", e);
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch (e) {
      console.warn("Gagal menyimpan keranjang:", e);
    }
  };

  const addToCart = (item: RentalItem, categoryName: string, durationDays: number) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      item,
      categoryName,
      durationDays,
      totalPrice: item.pricePerDay * durationDays,
      addedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...cartItems];
    saveCart(updated);
  };

  const removeFromCart = (cartId: string) => {
    const updated = cartItems.filter((i) => i.id !== cartId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
}
