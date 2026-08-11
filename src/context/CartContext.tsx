"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryZone = "zone1" | "zone2" | "zone3" | "zone4" | "";

export const ZONE_PRICES: Record<string, number> = {
  zone1: 4000,
  zone2: 6000,
  zone3: 8000,
  zone4: 10000,
};

export const ZONE_LABELS: Record<string, string> = {
  zone1: "Zone 1 (Centre-ville)",
  zone2: "Zone 2 (Périphérie proche)",
  zone3: "Zone 3 (Périphérie lointaine)",
  zone4: "Zone 4 (Banlieue)",
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  shippingCost: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("lady_gasy_cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
    const storedZone = localStorage.getItem("lady_gasy_zone");
    if (storedZone) {
      setDeliveryZone(storedZone as DeliveryZone);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("lady_gasy_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Save zone to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("lady_gasy_zone", deliveryZone);
    }
  }, [deliveryZone, isInitialized]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDeliveryZone("");
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shippingCost = deliveryZone ? ZONE_PRICES[deliveryZone] || 0 : 0;

  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryZone,
        setDeliveryZone,
        shippingCost,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
