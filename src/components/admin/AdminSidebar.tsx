"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Store
} from "lucide-react";
import { supabase } from "@/data/supabase";

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear();
    window.location.href = "/connexion";
  };

  const navItems = [
    { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
    { name: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
    { name: "Produits", href: "/admin/produits", icon: Package },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface border-r border-outline-variant hidden md:flex flex-col py-lg px-md z-40">
      {/* Brand Header */}
      <div className="mb-xl px-xs">
        <Link href="/admin" className="font-display-lg text-display-lg text-primary italic">
          Lady Gasy
        </Link>
        <p className="font-caption text-caption text-on-surface-variant">Espace Administration</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-xs flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-sm px-md py-sm font-label-md text-label-md rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto space-y-xs pt-md border-t border-outline-variant/30">
        <Link
          href="/"
          className="flex items-center gap-sm px-md py-sm font-label-md text-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
        >
          <Store size={20} />
          <span>Voir la boutique</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-sm px-md py-sm font-label-md text-label-md text-error hover:bg-error-container/30 rounded-full transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
