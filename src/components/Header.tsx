"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import Footer from "@/components/Footer";

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: "Catalogue", href: "/catalogue" },
    { name: "Le Salon", href: "#" },
    { name: "À Propos", href: "#" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center px-lg py-md max-w-[1280px] mx-auto w-full">
        {/* Left: Mobile Menu & Search */}
        <div className="flex-1 md:flex-none flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden text-primary p-2 focus:outline-none hover:text-secondary transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            className="hidden md:flex text-primary hover:text-secondary transition-colors duration-300 p-2"
          >
            <Search size={24} />
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link
            href="/"
            className="font-display-lg text-display-lg text-primary italic hover:text-secondary transition-colors duration-300 whitespace-nowrap"
          >
            Lady Gasy
          </Link>
        </div>

        {/* Right: Navigation Links & Actions */}
        <div className="flex-grow justify-end hidden md:flex items-center gap-md">
          <nav className="flex gap-md font-body-md text-body-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-primary font-bold border-b-2 border-primary"
                      : "text-on-surface-variant hover:text-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-sm text-primary">
            <Link
              href="/connexion"
              aria-label="Profile"
              className="hover:text-secondary transition-colors duration-300 p-2"
            >
              <User size={24} />
            </Link>

            <Link
              href="/panier"
              aria-label="Cart"
              className="hover:text-secondary transition-colors duration-300 relative p-2 flex items-center"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-on-secondary text-xs rounded-full w-4 h-4 flex items-center justify-center font-label-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-sm text-primary">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            className="hover:text-secondary p-2"
          >
            <Search size={24} />
          </button>
          <Link
            href="/panier"
            aria-label="Cart"
            className="hover:text-secondary relative p-2 flex items-center"
          >
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-on-secondary text-xs rounded-full w-4 h-4 flex items-center justify-center font-label-md">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Slide-out Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-surface-container border-b border-outline-variant p-md transition-all duration-300 ease-in-out">
          <div className="max-w-[600px] mx-auto flex gap-sm items-center">
            <Search className="text-primary" size={24} />
            <input
              type="text"
              placeholder="Rechercher un ingrédient, un soin..."
              className="w-full bg-transparent border-b border-outline focus:border-primary outline-none py-xs text-on-surface"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-on-surface-variant hover:text-primary p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[104px] z-40 bg-surface-container-high transition-transform duration-300">
          <nav className="flex flex-col p-lg gap-md font-body-lg text-body-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-sm border-b border-outline-variant/30 ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-on-surface-variant"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/connexion"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-sm text-primary py-sm border-b border-outline-variant/30"
            >
              <User size={24} />
              Mon Compte
            </Link>
          </nav>
        </div>
      )}
    
    </header>
    
  );
}
