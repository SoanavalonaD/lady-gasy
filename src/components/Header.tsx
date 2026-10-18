"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Menu, X, Search, User, ShoppingBag, ArrowRight, LayoutDashboard } from "lucide-react";
import { getDbProducts } from "@/data/queries";
import { Product } from "@/data/types";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const navLinks = [
    { name: "Catalogue", href: "/catalogue" },
    { name: "Le Salon", href: "#" },
    { name: "À Propos", href: "#" },
    { name: "Contact", href: "/contact" },
  ];

  // Filter products for live suggestions
  const liveResults = searchQuery.trim()
    ? dbProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.categories &&
          product.categories.some((cat) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          ))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/catalogue?q=${encodeURIComponent(query)}`);
  };

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

          <div className="flex items-center gap-xs md:gap-sm text-primary">
            {isAdmin && (
              <Link
                href="/admin"
                aria-label="Espace Admin"
                title="Espace Administration"
                className="hover:text-secondary transition-colors duration-300 p-2 flex items-center gap-1 group text-primary"
              >
                <LayoutDashboard size={22} />
                <span className="hidden lg:inline text-xs font-label-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary px-2 py-0.5 rounded-full transition-all">
                  Admin
                </span>
              </Link>
            )}

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
        <div className="flex md:hidden items-center gap-xs text-primary">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            className="hover:text-secondary p-2"
          >
            <Search size={24} />
          </button>
          {isAdmin && (
            <Link
              href="/admin"
              aria-label="Espace Admin"
              title="Espace Administration"
              className="hover:text-secondary p-2"
            >
              <LayoutDashboard size={22} />
            </Link>
          )}
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
        <div className="absolute top-full left-0 w-full bg-surface-container-lowest border-b border-outline-variant p-md shadow-xl transition-all duration-300 ease-in-out z-50">
          <form onSubmit={handleSearchSubmit} className="max-w-[600px] mx-auto space-y-md">
            <div className="flex gap-sm items-center border-b border-outline focus-within:border-primary py-xs">
              <Search className="text-primary flex-shrink-0" size={24} />
              <input
                type="text"
                placeholder="Rechercher un soin, un ingrédient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-on-surface font-body-md"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-on-surface-variant hover:text-primary p-1 text-xs"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1"
                aria-label="Fermer la recherche"
              >
                <X size={24} />
              </button>
            </div>

            {/* Live Search Suggestions */}
            {searchQuery.trim() !== "" && (
              <div className="space-y-xs max-h-[300px] overflow-y-auto pt-xs">
                {liveResults.length > 0 ? (
                  <>
                    <p className="font-caption text-xs text-on-surface-variant uppercase tracking-wider mb-xs">
                      Produits trouvés ({liveResults.length}) :
                    </p>
                    {liveResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/catalogue/${product.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-md p-xs rounded-lg hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h4 className="font-label-md text-sm text-on-surface group-hover:text-primary font-medium">
                            {product.name}
                          </h4>
                          <p className="font-caption text-xs text-on-surface-variant line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                        <span className="font-label-md text-sm text-primary font-bold">
                          {product.priceAr.toLocaleString()} Ar
                        </span>
                      </Link>
                    ))}

                    <button
                      type="submit"
                      className="w-full mt-sm py-2 text-center text-xs font-label-md text-primary hover:text-secondary flex items-center justify-center gap-xs border-t border-outline-variant/30 pt-sm cursor-pointer"
                    >
                      Voir tous les résultats dans le catalogue
                      <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-md text-on-surface-variant italic text-sm">
                    Aucun produit ne correspond à &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </form>
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
