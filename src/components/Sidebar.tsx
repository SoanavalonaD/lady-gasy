"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [onClose]);

  // Handle clicking on links with filters
  const handleFilterClick = (category?: string) => {
    if (category) {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/products");
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-[55] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Navigation Drawer */}
      <nav
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col py-md bg-surface h-full w-80 rounded-r-3xl shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-md mb-8 flex justify-between items-center">
          <h2 className="font-serif text-headline-md text-primary">Lady Gasy Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full focus:outline-none"
            aria-label="Fermer le menu"
          >
            <span className="material-symbols-outlined block">close</span>
          </button>
        </div>

        <ul className="flex flex-col gap-2 flex-grow">
          <li>
            <button
              onClick={() => handleFilterClick()}
              className="w-[calc(100%-16px)] text-left flex items-center gap-4 px-md py-3 text-on-surface-variant hover:bg-surface-container mx-2 my-1 rounded-full hover:bg-surface-container-high transition-all font-sans font-medium text-body-md"
            >
              <span className="material-symbols-outlined">grid_view</span>
              <span>Tous les produits</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleFilterClick("Hydratation")}
              className="w-[calc(100%-16px)] text-left flex items-center gap-4 px-md py-3 text-on-surface-variant hover:bg-surface-container mx-2 my-1 rounded-full hover:bg-surface-container-high transition-all font-sans font-medium text-body-md"
            >
              <span className="material-symbols-outlined">water_drop</span>
              <span>Hydratation</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleFilterClick("Volume & Boucles")}
              className="w-[calc(100%-16px)] text-left flex items-center gap-4 px-md py-3 text-on-surface-variant hover:bg-surface-container mx-2 my-1 rounded-full hover:bg-surface-container-high transition-all font-sans font-medium text-body-md"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Volume &amp; Boucles</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleFilterClick("Accessoires")}
              className="w-[calc(100%-16px)] text-left flex items-center gap-4 px-md py-3 text-on-surface-variant hover:bg-surface-container mx-2 my-1 rounded-full hover:bg-surface-container-high transition-all font-sans font-medium text-body-md"
            >
              <span className="material-symbols-outlined">auto_fix_high</span>
              <span>Accessoires</span>
            </button>
          </li>
          <li>
            <Link
              href="/#story"
              onClick={onClose}
              className="flex items-center gap-4 px-md py-3 text-on-surface-variant hover:bg-surface-container mx-2 my-1 rounded-full hover:bg-surface-container-high transition-all font-sans font-medium text-body-md"
            >
              <span className="material-symbols-outlined">menu_book</span>
              <span>Notre Histoire</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
