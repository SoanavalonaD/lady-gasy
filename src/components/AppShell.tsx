"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomNavBar } from "./BottomNavBar";
import { Footer } from "./Footer";
import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {/* 
        Simplified Header for Checkout, 
        Responsive Standard Header for other pages
      */}
      {isCheckout ? (
        <header className="flex justify-between items-center px-container-padding h-16 w-full fixed top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
          <Link
            href="/cart"
            className="flex items-center text-on-surface-variant hover:text-secondary transition-colors duration-300"
            aria-label="Retour au panier"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="font-serif text-headline-md tracking-tight text-primary">
            Lady Gasy
          </div>
          <div className="w-6"></div> {/* Spacer for center alignment */}
        </header>
      ) : (
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
      )}

      {/* Sidebar Navigation Drawer */}
      {!isCheckout && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-16 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Bar (hidden on checkout page) */}
      {!isCheckout && <BottomNavBar />}

      {/* Footer (hidden on checkout page) */}
      {!isCheckout && <Footer />}
    </div>
  );
};
