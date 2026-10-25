"use client";

import React, { useState, useEffect, use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getDbProducts } from "@/data/queries";
import Link from "next/link";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Layers,
} from "lucide-react";
import { parseProductQuantity } from "@/utils/productVariants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(id);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    getDbProducts().then((data) => {
      setDbProducts(data);
      setLoading(false);
    });
  }, []);

  // Synchronise si l'URL params id change
  useEffect(() => {
    setSelectedProductId(id);
  }, [id]);

  const rawProduct = dbProducts.find((p) => p.id === id);

  // Trouver toutes les déclinaisons (variantes de contenance) du même produit
  const variants = React.useMemo(() => {
    if (!rawProduct || dbProducts.length === 0) return [];

    const { baseName: currentBaseName } = parseProductQuantity(rawProduct.name);
    const currentCategory = (rawProduct.rawCategory || "").toUpperCase();

    const related = dbProducts.filter((p) => {
      const { baseName } = parseProductQuantity(p.name);
      const cat = (p.rawCategory || "").toUpperCase();
      return (
        baseName.toLowerCase() === currentBaseName.toLowerCase() &&
        (!currentCategory || !cat || cat === currentCategory)
      );
    });

    return [...related]
      .sort((a, b) => a.priceAr - b.priceAr)
      .map((p) => {
        const { size } = parseProductQuantity(p.name);
        return {
          id: p.id,
          size: size || "",
          priceAr: p.priceAr,
          product: p,
        };
      });
  }, [rawProduct, dbProducts]);

  // Produit actif (dépend de la déclinaison sélectionnée)
  const product = dbProducts.find((p) => p.id === selectedProductId) || rawProduct;

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-[120px] pb-xl max-w-[1280px] mx-auto w-full px-container-padding text-center flex flex-col items-center justify-center min-h-[50vh]">
          <p className="animate-pulse text-primary font-medium text-lg">Chargement du produit...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-[120px] pb-xl max-w-[1280px] mx-auto w-full px-container-padding text-center flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="font-display-lg text-headline-lg text-primary mb-md">
            Produit introuvable
          </h1>
          <p className="font-body-md text-on-surface-variant mb-lg">
            Le soin botanique que vous recherchez n&apos;est pas ou plus disponible dans notre catalogue.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center bg-primary text-on-primary font-label-md px-lg py-md rounded hover:bg-surface-tint transition-all shadow-sm"
          >
            Retourner au catalogue
            <ArrowRight className="ml-sm" size={16} />
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setToastMessage(`"${product.name}" a été ajouté au panier !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const category = product.categories?.[0] || "Soins Capillaires";

  return (
    <>
      <Header />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-container-padding md:px-lg py-xl pt-[120px] bg-background">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-lg right-lg z-50 bg-primary text-on-primary font-label-md px-lg py-md rounded-xl shadow-lg transition-all duration-300 flex items-center gap-sm animate-bounce">
            <CheckCircle2 size={24} />
            {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg md:gap-xl">
          {/* Image Display */}
          <div className="md:col-span-6 flex flex-col gap-sm">
            <div className="aspect-[2/3] w-full relative rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/30">
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                src={product.image}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-6 flex flex-col gap-md">
            {/* Breadcrumb & Category */}
            <div className="flex flex-col gap-base">
              <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption">
                <Link className="hover:text-primary transition-colors" href="/">
                  Accueil
                </Link>
                <span>/</span>
                <Link className="hover:text-primary transition-colors" href="/catalogue">
                  Catalogue
                </Link>
                <span>/</span>
                <span className="text-primary">{category}</span>
              </div>
              <span className="text-secondary font-label-md text-label-md uppercase tracking-wider">
                {product.needs?.[0] || "Soin Botanique"}
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                {product.name}
              </h1>
              <div className="flex items-end gap-sm mb-4">
                <span className="font-headline-md text-headline-md text-on-surface">
                  {product.priceAr.toLocaleString()} Ar
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary font-caption text-caption">
                <div className="flex text-secondary">
                  <Star className="fill-current text-sm" size={16} />
                  <Star className="fill-current text-sm" size={16} />
                  <Star className="fill-current text-sm" size={16} />
                  <Star className="fill-current text-sm" size={16} />
                  <Star className="text-sm" size={16} />
                </div>
                <span className="text-on-surface-variant ml-1">
                  ({product.reviewsCount || 128} avis)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Product Variants (Declinaisons / Formats de contenance) */}
            {variants.length > 1 && (
              <div className="flex flex-col gap-2 pt-2 pb-1 border-t border-surface-variant">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-on-surface flex items-center gap-1.5">
                    <Layers size={16} className="text-secondary" />
                    Choisir un format / contenance :
                  </span>
                  <span className="font-caption text-xs text-on-surface-variant">
                    {variants.length} formats disponibles
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {variants.map((v) => {
                    const isSelected = v.id === product.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedProductId(v.id)}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-label-md transition-all flex flex-col items-center min-w-[90px] cursor-pointer ${
                          isSelected
                            ? "bg-primary text-on-primary border-primary shadow-sm scale-102"
                            : "bg-surface-container-low text-on-surface border-outline-variant/60 hover:border-primary hover:bg-surface-container-high"
                        }`}
                      >
                        <span className="font-semibold">{v.size || "Standard"}</span>
                        <span
                          className={`text-[12px] mt-0.5 ${
                            isSelected ? "text-on-primary/90" : "text-primary"
                          }`}
                        >
                          {v.priceAr.toLocaleString()} Ar
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock & Actions */}
            <div className="flex flex-col gap-sm pt-sm border-t border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 size={20} />
                <span className="font-label-md text-label-md">En stock - Expédition sous 24h</span>
              </div>
              <div className="flex items-center gap-md mt-2">
                {/* Quantity */}
                <div className="flex items-center border border-outline rounded-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-on-surface hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-body-md text-body-md select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-on-surface hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <ShoppingCart size={18} />
                  Ajouter au panier
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className={`p-3 border rounded-sm transition-colors flex items-center justify-center cursor-pointer ${
                    isWishlist
                      ? "bg-secondary-container text-on-secondary-container border-secondary-container"
                      : "border-outline text-on-surface hover:text-secondary hover:border-secondary"
                  }`}
                  aria-label="Ajouter aux favoris"
                >
                  <Heart className={isWishlist ? "fill-current" : ""} size={18} />
                </button>
              </div>
            </div>

            {/* Accordions for Details */}
            <div className="mt-md flex flex-col border-t border-surface-variant">
              <details className="group border-b border-surface-variant">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none font-label-md text-label-md text-on-surface">
                  <span>Ingrédients</span>
                  <ChevronDown className="group-open:rotate-180 transition-transform duration-300" size={20} />
                </summary>
                <div className="pb-4 font-body-md text-body-md text-on-surface-variant space-y-2">
                  <p>{product.ingredients || "100% d'origine naturelle. Formulé sans silicones, sans parabènes, sans sulfates ni huiles minérales."}</p>
                </div>
              </details>
              <details className="group border-b border-surface-variant">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none font-label-md text-label-md text-on-surface">
                  <span>Conseils d&apos;utilisation</span>
                  <ChevronDown className="group-open:rotate-180 transition-transform duration-300" size={20} />
                </summary>
                <div className="pb-4 font-body-md text-body-md text-on-surface-variant">
                  <ul className="list-disc pl-5 space-y-2">
                    {product.usage ? (
                      product.usage.map((step: string, idx: number) => <li key={idx}>{step}</li>)
                    ) : (
                      <>
                        <li>En soin quotidien : Appliquer une petite quantité sur les pointes pour sceller l&apos;hydratation.</li>
                        <li>En bain d&apos;huile : Appliquer généreusement sur les longueurs, laisser poser 30 minutes sous un bonnet chaud puis rincer en procédant au shampoing.</li>
                      </>
                    )}
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
