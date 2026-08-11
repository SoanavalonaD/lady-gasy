"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-16 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/20 pb-safe md:hidden text-primary">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-full h-full transition-transform duration-300 ${
          isActive("/") ? "text-primary font-semibold" : "text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined mb-1">home</span>
        <span className="font-sans text-[10px] leading-tight">Accueil</span>
      </Link>

      <Link
        href="/products"
        className={`flex flex-col items-center justify-center w-full h-full transition-transform duration-300 ${
          isActive("/products") ? "text-primary font-semibold" : "text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined mb-1">spa</span>
        <span className="font-sans text-[10px] leading-tight">Boutique</span>
      </Link>

      <Link
        href="/cart"
        className={`flex flex-col items-center justify-center w-full h-full transition-transform duration-300 ${
          isActive("/cart") ? "text-primary font-semibold" : "text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined mb-1">shopping_bag</span>
        <span className="font-sans text-[10px] leading-tight">Panier</span>
      </Link>

      <Link
        href="/#contact"
        className={`flex flex-col items-center justify-center w-full h-full transition-transform duration-300 ${
          isActive("/contact") ? "text-primary font-semibold" : "text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined mb-1">mail</span>
        <span className="font-sans text-[10px] leading-tight">Contact</span>
      </Link>
    </nav>
  );
};
