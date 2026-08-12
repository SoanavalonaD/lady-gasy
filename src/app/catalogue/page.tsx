"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { CheckCircle2, Search } from "lucide-react";
import Link from "next/link";

export default function Catalogue() {
  const { addToCart } = useCart();
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(["Définition des Boucles"]); // Default checked in mockup
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Filter products based on selected needs and categories
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // If need filter is active, product must match at least one selected need
      const matchesNeeds =
        selectedNeeds.length === 0 ||
        (product.needs && product.needs.some((need) => selectedNeeds.includes(need)));

      // If category filter is active, product must match at least one selected category
      const matchesCategories =
        selectedCategories.length === 0 ||
        (product.categories &&
          product.categories.some((cat) => selectedCategories.includes(cat)));

      return matchesNeeds && matchesCategories;
    });
  }, [selectedNeeds, selectedCategories]);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
    setToastMessage(`"${product.name}" a été ajouté au panier !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allNeeds = ["Hydratation Profonde", "Définition des Boucles", "Volume & Densité"];
  const allCategories = [
    "Shampoings & Lavants",
    "Soins & Masques",
    "Huiles & Sérums",
    "Accessoires",
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
                {/* Besoins */}
                <div>
                  <h3 className="font-body-md text-primary mb-sm font-semibold">Besoins</h3>
                  <ul className="space-y-xs font-body-md text-on-surface-variant">
                    {allNeeds.map((need) => (
                      <li key={need}>
                        <label className="flex items-center gap-sm cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedNeeds.includes(need)}
                            onChange={() => handleNeedChange(need)}
                            className="form-checkbox text-primary rounded-sm border-outline focus:ring-primary-container bg-transparent"
                          />
                          <span
                            className={`group-hover:text-primary transition-colors ${
                              selectedNeeds.includes(need) ? "text-primary font-medium" : ""
                            }`}
                          >
                            {need}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Catégories */}
                <div>
                  <h3 className="font-body-md text-primary mb-sm font-semibold">Catégories</h3>
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
            {filteredProducts.length === 0 ? (
              <div className="text-center py-xl bg-surface-container-low rounded-xl border border-outline-variant/30">
                <Search className="text-on-surface-variant mb-md mx-auto" size={36} />
                <p className="font-body-lg text-on-surface-variant">
                  Aucun produit ne correspond à ces critères de recherche.
                </p>
                <button
                  onClick={() => {
                    setSelectedNeeds([]);
                    setSelectedCategories([]);
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
                    <div className="relative h-[300px] bg-surface-container-low overflow-hidden flex items-center justify-center p-md">
                      <Link href={`/catalogue/${product.id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                        <img
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
                          {product.priceEur.toFixed(2)} Ar
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
