"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/types";
import { getDbProducts } from "@/data/queries";
import { CheckCircle2, Search } from "lucide-react";
import Link from "next/link";

export default function Catalogue() {
  const { addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read ?q= URL parameter on load or change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
  }, []);

  useEffect(() => {
    getDbProducts()
      .then((data) => {
        setDbProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement des produits:", err);
        setError("Impossible de charger les produits. Veuillez réessayer.");
        setLoading(false);
      });
  }, []);

  const handleNeedChange = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Filter products based on search query, selected needs, and categories
  const filteredProducts = useMemo(() => {
    return dbProducts.filter((product) => {
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.categories &&
          product.categories.some((cat) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      const matchesNeeds =
        selectedNeeds.length === 0 ||
        (product.needs && product.needs.some((need) => selectedNeeds.includes(need)));

      const matchesCategories =
        selectedCategories.length === 0 ||
        (product.rawCategory &&
          selectedCategories.includes(product.rawCategory.toUpperCase())) ||
        (product.categories &&
          product.categories.some(
            (cat) =>
              selectedCategories.includes(cat.toUpperCase()) ||
              (cat === "Soins & Masques" && selectedCategories.includes("CHEVEUX"))
          ));

      return matchesSearch && matchesNeeds && matchesCategories;
    });
  }, [dbProducts, searchQuery, selectedNeeds, selectedCategories]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setToastMessage(`"${product.name}" a été ajouté au panier !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allNeeds = ["Hydratation Profonde", "Définition des Boucles", "Volume & Densité"];
  const allCategories = [
    "CHEVEUX",
    "ONGLES",
    "ACCESSOIRES",
    "CILS",
    "LEVRES",
  ];

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-container-padding md:px-lg py-xl pt-[120px]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-lg right-lg z-50 bg-primary text-on-primary font-label-md px-lg py-md rounded-xl shadow-lg transition-all duration-300 flex items-center gap-sm animate-bounce">
            <CheckCircle2 size={24} />
            {toastMessage}
          </div>
        )}

        {/* Header Section */}
        <div className="mb-xl text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-sm">
            Notre Catalogue Botanique
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-2xl">
            Découvrez notre sélection de soins naturels conçus avec l&apos;expertise botanique Lady Gasy pour sublimer vos cheveux texturés.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-xl">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-[120px] bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30">
              <h2 className="font-label-md text-on-surface mb-md border-b border-outline-variant pb-2 tracking-wider">
                FILTRER PAR
              </h2>
              <div className="space-y-md">
                <div>
                  <ul className="space-y-xs font-body-md text-on-surface-variant">
                    {allCategories.map((cat) => (
                      <li key={cat}>
                        <label className="flex items-center gap-sm cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                            className="form-checkbox text-primary rounded-sm border-outline focus:ring-primary-container bg-transparent"
                          />
                          <span
                            className={`group-hover:text-primary transition-colors ${
                              selectedCategories.includes(cat) ? "text-primary font-medium" : ""
                            }`}
                          >
                            {cat}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {searchQuery && (
              <div className="mb-md flex items-center justify-between bg-primary-container/20 border border-primary/30 p-sm rounded-lg">
                <span className="font-body-md text-sm text-primary font-medium">
                  Résultats de recherche pour : <strong className="italic">&quot;{searchQuery}&quot;</strong> ({filteredProducts.length})
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.history.replaceState({}, "", "/catalogue");
                  }}
                  className="font-label-md text-xs text-primary underline hover:text-secondary transition-colors cursor-pointer"
                >
                  Effacer la recherche
                </button>
              </div>
            )}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface-container-low rounded-xl border border-outline-variant/20 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-surface-container" />
                    <div className="p-md space-y-sm">
                      <div className="h-4 bg-surface-container rounded w-3/4" />
                      <div className="h-3 bg-surface-container rounded w-1/2" />
                      <div className="h-6 bg-surface-container rounded w-1/3 mt-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-xl bg-surface-container-low rounded-xl border border-outline-variant/30">
                <p className="font-body-lg text-error mb-md">{error}</p>
                <button
                  onClick={() => { setError(null); setLoading(true); getDbProducts().then(setDbProducts).finally(() => setLoading(false)); }}
                  className="mt-md text-primary font-label-md underline hover:text-secondary transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-xl bg-surface-container-low rounded-xl border border-outline-variant/30">
                <Search className="text-on-surface-variant mb-md mx-auto" size={36} />
                <p className="font-body-lg text-on-surface-variant">
                  Aucun produit ne correspond à ces critères de recherche.
                </p>
                <button
                  onClick={() => {
                    setSelectedNeeds([]);
                    setSelectedCategories([]);
                    setSearchQuery("");
                    window.history.replaceState({}, "", "/catalogue");
                  }}
                  className="mt-md text-primary font-label-md underline hover:text-secondary transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-surface-container-lowest border border-[#E0D7CC] rounded-lg overflow-hidden hover:shadow-[0_20px_40px_rgba(51,69,13,0.1)] transition-all duration-300"
                  >
                    <div className="relative h-[300px] overflow-hidden">
                      <Link href={`/catalogue/${product.id}`} className="absolute inset-0 cursor-pointer">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={product.image}
                          alt={product.name}
                        />
                      </Link>
                      {/* Quick Add Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 flex justify-center bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/40 to-transparent pt-lg">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-primary text-on-primary font-label-md py-3 rounded hover:bg-surface-tint transition-colors cursor-pointer shadow-sm hover:shadow-md"
                        >
                          Ajouter au Panier
                        </button>
                      </div>
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                      <Link href={`/catalogue/${product.id}`} className="hover:text-primary transition-colors">
                        <h3 className="font-headline-md text-primary mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-caption text-on-surface-variant mb-md flex-grow">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-label-md text-primary">
                          {product.priceAr.toLocaleString()} Ar
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
