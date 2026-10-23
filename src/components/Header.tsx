"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Menu,
  X,
  Search,
  User,
  ShoppingBag,
  Heart,
  Store,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { getDbProducts } from "@/data/queries";
import { Product } from "@/data/types";
import { groupProductsByVariant, parseProductQuantity } from "@/utils/productVariants";

function HeaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCat = (searchParams?.get("cat") || "").toUpperCase().replace(/\s+/g, "_");
  const router = useRouter();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load products for live search suggestions
  useEffect(() => {
    getDbProducts()
      .then((data) => setDbProducts(data))
      .catch((err) => console.error("Search header products load error:", err));
  }, []);

  // Check if current logged in user has ADMIN role
  useEffect(() => {
    function checkAdminStatus() {
      const role = sessionStorage.getItem("userRole");
      const logged = sessionStorage.getItem("isLoggedIn") === "true";
      setIsAdmin(logged && role === "ADMIN");
    }

    checkAdminStatus();
    window.addEventListener("storage", checkAdminStatus);
    return () => window.removeEventListener("storage", checkAdminStatus);
  }, []);

  // Close live search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The 8 requested menu links
  const navLinks = [
    { name: "Top ventes", href: "/catalogue" },
    { name: "Visage", href: "/catalogue?cat=VISAGE" },
    { name: "Cheveux", href: "/catalogue?cat=CHEVEUX" },
    { name: "Corps", href: "/catalogue?cat=CORPS" },
    { name: "Huiles essentielles", href: "/catalogue?cat=HUILES_ESSENTIELLES" },
    { name: "Conseils & recettes", href: "/diy" },
    { name: "Accessoires", href: "/catalogue?cat=ACCESSOIRES" },
    { name: "Contact", href: "/contact" },
  ];

  // Filter products for live suggestions (groupés par nom de produit sans quantité)
  const liveResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.trim().toLowerCase();
    const matchedProducts = dbProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.categories &&
          product.categories.some((cat) => cat.toLowerCase().includes(query)))
    );

    // Regrouper par variantes pour ne garder qu'un seul résultat par produit
    // avec le nom de base épuré de toute contenance / quantité (ex: 50g, 100ml)
    const grouped = groupProductsByVariant(matchedProducts);

    return grouped.slice(0, 5).map((p) => {
      const { baseName } = parseProductQuantity(p.name);
      return {
        ...p,
        displayName: baseName || p.name,
      };
    });
  }, [dbProducts, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    router.push(`/catalogue?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fffdfb] border-b border-[#e5dfd8] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">

      {/* Main Bar: Logo, Central Search Input, Actions */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4 md:gap-6">
        {/* Left Mobile Menu Trigger */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu de navigation"
            className="p-2 text-[#3e3b3e] hover:text-[#33450d] rounded-full hover:bg-[#f5f0e8] transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Rechercher"
            className="p-2 text-[#3e3b3e] hover:text-[#33450d] rounded-full hover:bg-[#f5f0e8] transition-colors"
          >
            <Search size={22} />
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="font-serif text-2xl sm:text-[28px] font-bold text-[#33450d] tracking-tight hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <span className="italic">Lady Gasy</span>
          </Link>
        </div>

        {/* Central Search Bar (Aroma-Zone style with rounded pill) */}
        <div
          ref={searchContainerRef}
          className="hidden md:flex flex-1 max-w-[560px] relative mx-2"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center h-10 rounded-full border border-[#d2d5da] bg-[#ffffff] px-4 hover:border-[#3e3b3e] focus-within:border-[#33450d] focus-within:ring-1 focus-within:ring-[#33450d] transition-all shadow-sm"
          >
            <input
              type="search"
              placeholder="Rechercher un soin, un ingrédient, une recette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-transparent outline-none text-sm text-[#3e3b3e] placeholder:text-[#6c727f] pr-2"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#6c727f] hover:text-[#3e3b3e] p-1 mr-1 text-xs"
                aria-label="Effacer"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              aria-label="Lancer la recherche"
              className="text-[#3e3b3e] hover:text-[#33450d] flex-shrink-0 cursor-pointer"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Live Search Suggestions Dropdown */}
          {isSearchFocused && searchQuery.trim() !== "" && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#ffffff] rounded-2xl border border-[#e5dfd8] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1">
              {liveResults.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-[#8f95a0] uppercase tracking-wider px-2 py-1">
                    Suggestions produits ({liveResults.length})
                  </p>
                  {liveResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/catalogue/${product.id}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f8f4ef] transition-colors group cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-[#e5dfd8]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#3e3b3e] group-hover:text-[#33450d] truncate">
                          {product.displayName}
                        </h4>
                        <p className="text-xs text-[#6c727f] truncate">
                          {product.description}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#33450d] flex-shrink-0">
                        {product.hasMultipleVariants ? "Dès " : ""}
                        {product.priceAr.toLocaleString()} Ar
                      </span>
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full mt-2 pt-2 border-t border-[#f0e8dc] text-center text-xs font-semibold text-[#33450d] hover:text-[#8e4d33] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Voir tous les résultats
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-[#6c727f] italic">
                  Aucun produit ne correspond à &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Header Icons / Options: Boutiques, Favoris, Admin, Compte, Panier */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#3e3b3e]">
          {/* Nos Boutiques (Aroma-Zone Store Locator style) */}
          <Link
            href="/contact"
            title="Nos Boutiques"
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-[#f5f0e8] hover:text-[#33450d] transition-colors group"
          >
            <Store size={22} className="text-[#3e3b3e] group-hover:text-[#33450d] transition-colors" />
            <span className="hidden xl:inline text-xs font-medium text-[#3e3b3e] group-hover:text-[#33450d]">
              Nos boutiques
            </span>
          </Link>

          {/* Favoris (Heart icon - Aroma-Zone style) */}
          <Link
            href="/catalogue"
            title="Mes Favoris"
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-[#f5f0e8] hover:text-[#8e4d33] transition-colors group"
          >
            <Heart size={22} className="text-[#3e3b3e] group-hover:text-[#8e4d33] transition-colors" />
            <span className="hidden xl:inline text-xs font-medium text-[#3e3b3e] group-hover:text-[#8e4d33]">
              Favoris
            </span>
          </Link>

          {/* Espace Admin (if role is admin) */}
          {isAdmin && (
            <Link
              href="/admin"
              aria-label="Espace Admin"
              title="Espace Administration"
              className="flex items-center gap-1 p-2 rounded-full hover:bg-[#f5f0e8] hover:text-[#33450d] transition-colors group"
            >
              <LayoutDashboard size={22} />
              <span className="hidden lg:inline text-[10px] font-bold bg-[#33450d]/10 text-[#33450d] px-2 py-0.5 rounded-full">
                Admin
              </span>
            </Link>
          )}

          {/* Mon Compte */}
          <Link
            href="/connexion"
            aria-label="Mon Compte"
            title="Mon Compte"
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-[#f5f0e8] hover:text-[#33450d] transition-colors group"
          >
            <User size={22} className="text-[#3e3b3e] group-hover:text-[#33450d]" />
            <span className="hidden xl:inline text-xs font-medium text-[#3e3b3e] group-hover:text-[#33450d]">
              Connexion
            </span>
          </Link>

          {/* Panier */}
          <Link
            href="/panier"
            aria-label="Panier"
            title="Panier"
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-[#f5f0e8] hover:text-[#33450d] transition-colors relative group"
          >
            <ShoppingBag size={22} className="text-[#3e3b3e] group-hover:text-[#33450d]" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-[#8e4d33] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="hidden xl:inline text-xs font-medium text-[#3e3b3e] group-hover:text-[#33450d]">
              Panier
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-[#e5dfd8] bg-[#ffffff] p-3 shadow-md animate-in fade-in">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="flex-1 flex items-center h-10 rounded-full border border-[#d2d5da] bg-[#ffffff] px-4">
              <Search size={18} className="text-[#6c727f] mr-2 flex-shrink-0" />
              <input
                type="search"
                placeholder="Rechercher un soin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent outline-none text-sm text-[#3e3b3e]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[#6c727f] p-1 text-xs"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="text-xs text-[#3e3b3e] font-medium px-2 py-1"
            >
              Fermer
            </button>
          </form>
        </div>
      )}

      {/* Horizontal Categories Nav Bar (Aroma-Zone Menu Bar style) */}
      <nav
        aria-label="Navigation principale"
        className="hidden md:flex border-t border-[#ece7e1] bg-[#ffffff] overflow-x-auto scrollbar-none"
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isTopVentes = link.name === "Top ventes";

            let isActive = false;
            if (pathname === "/catalogue") {
              if (link.href === "/catalogue") {
                // Top ventes active only when no cat param
                isActive = !currentCat;
              } else if (link.href.includes("?cat=")) {
                const linkCat = link.href.split("?cat=")[1]?.toUpperCase().replace(/\s+/g, "_");
                if (linkCat === "HUILES_ESSENTIELLES" || linkCat === "HUILES") {
                  isActive = currentCat === "HUILES_ESSENTIELLES" || currentCat === "HUILES";
                } else {
                  isActive = currentCat === linkCat;
                }
              }
            } else if (pathname === "/diy" && link.href === "/diy") {
              isActive = true;
            } else if (pathname === "/contact" && link.href === "/contact") {
              isActive = true;
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`py-2.5 px-2.5 lg:px-3 text-[13px] lg:text-[14px] font-medium whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? "border-[#33450d] text-[#33450d] font-bold"
                    : isTopVentes
                    ? "border-transparent text-[#8e4d33] font-semibold hover:text-[#783c24] hover:border-[#8e4d33]/40"
                    : "border-transparent text-[#3e3b3e] hover:text-[#33450d] hover:border-[#33450d]/40"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[110px] z-40 bg-white/95 backdrop-blur-md overflow-y-auto animate-in fade-in">
          {/* Quick Shortcuts */}
          <div className="p-4 bg-[#f8f4ef] border-b border-[#e5dfd8] flex justify-around text-center text-xs">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 text-[#3e3b3e] hover:text-[#33450d]"
            >
              <Store size={22} className="text-[#33450d]" />
              <span className="font-medium">Nos boutiques</span>
            </Link>
            <Link
              href="/catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 text-[#3e3b3e] hover:text-[#8e4d33]"
            >
              <Heart size={22} className="text-[#8e4d33]" />
              <span className="font-medium">Favoris</span>
            </Link>
            <Link
              href="/connexion"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 text-[#3e3b3e] hover:text-[#33450d]"
            >
              <User size={22} className="text-[#33450d]" />
              <span className="font-medium">Mon compte</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-4 divide-y divide-[#f0e8dc] text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 flex items-center justify-between font-medium ${
                  link.name === "Top ventes"
                    ? "text-[#8e4d33] font-bold"
                    : "text-[#3e3b3e] hover:text-[#33450d]"
                }`}
              >
                <span>{link.name}</span>
                <ArrowRight size={16} className="text-[#8f95a0]" />
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 flex items-center justify-between text-[#33450d] font-bold"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Administration
                </span>
                <ArrowRight size={16} className="text-[#33450d]" />
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] border-b border-[#e5dfd8] shadow-xs h-[110px]" />
      }
    >
      <HeaderContent />
    </Suspense>
  );
}

