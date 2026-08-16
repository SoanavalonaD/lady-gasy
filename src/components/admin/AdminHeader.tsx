"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, User } from "lucide-react";

export default function AdminHeader() {
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      );
      setCurrentDateStr(
        now.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-container-padding md:px-xl w-full z-30">
      {/* Mobile Title */}
      <div className="md:hidden">
        <h1 className="font-display-lg text-lg text-primary italic">Lady Gasy Admin</h1>
      </div>

      {/* Global Search */}
      <div className="hidden md:flex items-center gap-sm bg-surface-container-low px-sm py-xs rounded-full border border-outline-variant/30 w-64 focus-within:border-primary transition-colors">
        <Search size={18} className="text-on-surface-variant" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="bg-transparent border-none outline-none font-body-md text-sm text-on-surface placeholder:text-on-surface-variant w-full"
        />
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-md">
        {/* Date / Time */}
        <div className="hidden lg:flex flex-col items-end mr-sm">
          <span className="font-label-md text-sm font-semibold text-on-surface">
            {currentTimeStr || "14:30"}
          </span>
          <span className="font-caption text-xs text-on-surface-variant capitalize">
            {currentDateStr || "Aujourd'hui"}
          </span>
        </div>

        <button
          aria-label="Notifications"
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors p-2 rounded-full relative cursor-pointer"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
        </button>

        <button
          aria-label="Paramètres"
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors p-2 rounded-full hidden sm:block cursor-pointer"
        >
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-xs pl-xs border-l border-outline-variant/30">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-outline-variant flex items-center justify-center text-primary font-bold text-xs">
            AG
          </div>
          <span className="hidden sm:inline-block font-label-md text-xs font-medium text-on-surface">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
