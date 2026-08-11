"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, products } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotalEur: number;
  subtotalAr: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("lady-gasy-cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setCartItems(parsed), 0);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    } else {
      // Default items from the mon-panier.html mockup
      const defaultItems: CartItem[] = [];
      const item1 = products.find((p) => p.id === "ricin-botanique");
      const item2 = products.find((p) => p.id === "mask-profonde");
      if (item1) defaultItems.push({ product: item1, quantity: 1 });
      if (item2) defaultItems.push({ product: item2, quantity: 1 });
      setTimeout(() => setCartItems(defaultItems), 0);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  // Save to localStorage when cart items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lady-gasy-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotalEur = cartItems.reduce(
    (sum, item) => sum + item.product.priceEur * item.quantity,
    0
  );

  const subtotalAr = cartItems.reduce(
    (sum, item) => sum + item.product.priceAr * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotalEur,
        subtotalAr,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
