"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/types";
import { getDbProducts } from "@/data/queries";
import { CheckCircle2, ChevronLeft, ChevronRight, Layers, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { groupProductsByVariant, GroupedProduct } from "@/utils/productVariants";

const PRODUCTS_PER_PAGE = 9;

function CatalogueContent() {
  const { addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();

  // Read ?q= and ?cat= URL parameters on load or change
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
    else setSearchQuery("");

    const cat = searchParams.get("cat");
    if (cat) {
      const upper = cat.toUpperCase().replace(/\s+/g, "_");
      if (upper === "HUILES" || upper === "HUILE" || upper === "HUILES_ESSENTIELLES") {
        setSelectedCategories(["HUILES ESSENTIELLES"]);
      } else {
        setSelectedCategories([upper]);
      }
    } else {
      // Top ventes / Pas de catégorie spécifiée : affiche tous les produits
      setSelectedCategories([]);
    }
  }, [searchParams]);

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

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedNeeds, selectedCategories]);

  const handleNeedChange = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      if (next.length === 1) {
        const catParam = next[0].replace(/\s+/g, "_");
        router.push(`/catalogue?cat=${encodeURIComponent(catParam)}`, { scroll: false });
      } else {
        router.push("/catalogue", { scroll: false });
      }

      return next;
    });
  };

  // Filter products based on search query, selected needs, and categories, then group by variants
  const filteredProducts = useMemo(() => {
    const rawFiltered = dbProducts.filter((product) => {
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
          selectedCategories.some((sel) => {
            const normSel = sel.toUpperCase().replace(/\s+/g, "_");
            const normRaw = product.rawCategory?.toUpperCase().replace(/\s+/g, "_");
            return normSel === normRaw;
          })) ||
        (product.categories &&
          product.categories.some(
            (cat) =>
              selectedCategories.some((sel) => {
                const normSel = sel.toUpperCase().replace(/\s+/g, "_");
                const normCat = cat.toUpperCase().replace(/\s+/g, "_");
                return normSel === normCat;
              }) ||
              (cat === "Soins & Masques" && selectedCategories.includes("CHEVEUX"))
          ));

      return matchesSearch && matchesNeeds && matchesCategories;
    });

    return groupProductsByVariant(rawFiltered);
  }, [dbProducts, searchQuery, selectedNeeds, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setToastMessage(`"${product.name}" a été ajouté au panier !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allNeeds = ["Hydratation Profonde", "Définition des Boucles", "Volume & Densité"];
  const allCategories = [
    "VISAGE",
    "CHEVEUX",
    "CORPS",
    "HUILES ESSENTIELLES",
    "ACCESSOIRES",
  ];

  const categoryLabels: Record<string, string> = {
    VISAGE: "Visage",
    CHEVEUX: "Cheveux",
    CORPS: "Corps",
    "HUILES ESSENTIELLES": "Huiles essentielles",
    HUILES_ESSENTIELLES: "Huiles essentielles",
    ACCESSOIRES: "Accessoires",
  };

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
        <ScrollReveal direction="down">
          <div className="mb-xl text-center md:text-left">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-sm">
              {selectedCategories.length === 1
                ? categoryLabels[selectedCategories[0]] || selectedCategories[0]
                : "Notre Catalogue Botanique"}
            </h1>
            <p className="font-body-md text-on-surface-variant max-w-2xl">
              {selectedCategories.length === 1
                ? `Découvrez tous nos soins et pépites botaniques pour la catégorie ${categoryLabels[selectedCategories[0]] || selectedCategories[0]}.`
                : "Découvrez notre sélection complète de soins naturels conçus avec l'expertise botanique Lady Gasy."}
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row gap-xl">
          {/* Sidebar Categories */}
          <aside className="w-full md:w-64 shrink-0">
            <ScrollReveal direction="left" delay={100}>
              <div className="sticky top-[120px] bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30">
                <div className="space-y-md">
                  <div>
                    <ul className="space-y-xs font-body-md text-on-surface-variant">
                      <li key="ALL">
                        <label className="flex items-center gap-sm cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.length === 0}
                            onChange={() => {
                              setSelectedCategories([]);
                              router.push("/catalogue", { scroll: false });
                            }}
                            className="form-checkbox text-primary rounded-sm border-outline focus:ring-primary-container bg-transparent"
                          />
                          <span
                            className={`group-hover:text-primary transition-colors ${
                              selectedCategories.length === 0 ? "text-primary font-bold" : ""
                            }`}
                          >
                            Tous les produits (Top ventes)
                          </span>
                        </label>
                      </li>
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
                              {categoryLabels[cat] || cat}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                  {currentProducts.map((product, index) => (
                    <ScrollReveal
                      key={product.id}
                      direction="up"
                      delay={(index % 3) * 100}
                    >
                      <div className="h-full group flex flex-col bg-surface-container-lowest border border-[#E0D7CC] rounded-lg overflow-hidden hover:shadow-[0_20px_40px_rgba(51,69,13,0.1)] transition-all duration-300">
                        <div className="relative h-[300px] overflow-hidden">
                          <Link href={`/catalogue/${product.id}`} className="absolute inset-0 cursor-pointer">
                            <img
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              src={product.image}
                              alt={product.name}
                            />
                          </Link>

                          {/* Multi-formats badge */}
                          {product.hasMultipleVariants && (
                            <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-primary/20 flex items-center gap-1.5 shadow-sm">
                              <Layers size={13} className="text-secondary" />
                              <span className="text-[11px] font-label-md text-primary tracking-wide">
                                {product.variants.length} formats ({product.variants.map((v) => v.size).join(" • ")})
                              </span>
                            </div>
                          )}

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
                            <div className="flex flex-col">
                              {product.hasMultipleVariants && (
                                <span className="text-[11px] text-on-surface-variant font-label-md uppercase tracking-wider">
                                  À partir de
                                </span>
                              )}
                              <span className="font-label-md text-primary">
                                {product.priceAr.toLocaleString()} Ar
                              </span>
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              aria-label={`Ajouter ${product.name} au panier`}
                              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300 cursor-pointer"
                            >
                              <ShoppingCart size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-xl flex flex-col sm:flex-row items-center justify-between gap-md pt-lg border-t border-outline-variant/30">
                    <p className="font-body-md text-sm text-on-surface-variant">
                      Affichage de <strong className="text-primary">{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}</strong> à{" "}
                      <strong className="text-primary">{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)}</strong> sur{" "}
                      <strong className="text-primary">{filteredProducts.length}</strong> produits
                    </p>

                    <div className="flex items-center gap-xs">
                      {/* Previous Page Arrow */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Page précédente"
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-label-md text-sm border transition-all cursor-pointer ${
                          currentPage === 1
                            ? "border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed bg-surface-container-low"
                            : "border-outline-variant/50 text-primary hover:bg-primary hover:text-on-primary hover:border-primary active:scale-95"
                        }`}
                      >
                        <ChevronLeft size={18} />
                        <span className="hidden sm:inline">Précédent</span>
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1 mx-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            aria-label={`Aller à la page ${pageNum}`}
                            className={`w-9 h-9 rounded-lg font-label-md text-sm transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-primary text-on-primary shadow-sm"
                                : "text-on-surface hover:bg-surface-container-high"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      {/* Next Page Arrow */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Page suivante"
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-label-md text-sm border transition-all cursor-pointer ${
                          currentPage === totalPages
                            ? "border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed bg-surface-container-low"
                            : "border-outline-variant/50 text-primary hover:bg-primary hover:text-on-primary hover:border-primary active:scale-95"
                        }`}
                      >
                        <span className="hidden sm:inline">Suivant</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function Catalogue() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex-grow w-full max-w-[1280px] mx-auto px-container-padding md:px-lg py-xl pt-[120px]">
            <div className="py-20 text-center text-on-surface-variant">Chargement du catalogue...</div>
          </main>
          <Footer />
        </>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}
