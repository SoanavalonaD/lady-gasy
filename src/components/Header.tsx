"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { cartCount } = useCart();

  return (
    <header className="flex justify-between items-center px-container-padding h-16 w-full fixed top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 text-primary">
      {/* Menu Toggle Button */}
      <button
        onClick={onMenuToggle}
        className="p-2 hover:text-secondary transition-colors duration-300 rounded-full focus:outline-none focus:ring-1 focus:ring-primary/20"
        aria-label="Ouvrir le menu"
      >
        <span className="material-symbols-outlined block">menu</span>
      </button>

      {/* Brand Title / Logo */}
      <Link href="/" className="focus:outline-none">
        <h1 className="font-serif text-headline-md tracking-tight text-primary hover:text-secondary transition-colors duration-300">
          Lady Gasy
        </h1>
      </Link>

      {/* Cart Icon with Badge */}
      <Link href="/cart" className="p-2 relative hover:text-secondary transition-colors duration-300 rounded-full focus:outline-none focus:ring-1 focus:ring-primary/20" aria-label="Voir le panier">
        <span className="material-symbols-outlined block">shopping_bag</span>
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
};
