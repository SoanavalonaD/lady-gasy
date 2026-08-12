"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Leaf, Rabbit, Recycle, Heart, ShoppingCart } from "lucide-react";

export default function Home() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const homeProductIds = ["ricin-bio", "coco-mask", "brume-fresh", "serum-baobab"];
  const featuredProducts = products.filter((p) => homeProductIds.includes(p.id));

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
    setToastMessage(`"${product.name}" a été ajouté au panier !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <>
      <Header />
      <main className="flex-grow pt-[104px]">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-lg right-lg z-50 bg-primary text-on-primary font-label-md px-lg py-md rounded-xl shadow-lg transition-all duration-300 flex items-center gap-sm animate-bounce">
            <CheckCircle2 size={24} />
            {toastMessage}
          </div>
        )}

        {/* Hero Section */}
        <section className="relative w-full h-[819px] min-h-[600px] flex items-center bg-surface-container-lowest overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full opacity-90 transition-transform duration-10000 hover:scale-105"
            style={{
              backgroundImage:
                "url('/background-image.jpg')",
            }}
          />
          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent md:w-1/2"></div>
          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-container-padding md:px-lg">
            <div className="glass-panel p-lg rounded-xl shadow-md">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-sm block">
                Expertise Botanique
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-md">
                Un havre de beauté naturelle
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                Découvrez le pouvoir de la nature avec notre gamme de soins capillaires bio, conçue spécifiquement pour sublimer les cheveux texturés et naturels.
              </p>
              <a
                className="inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded hover:bg-surface-tint transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                href="#essentiels"
              >
                Découvrir nos produits
                <ArrowRight className="ml-2" size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* Features / Trust Bar */}
        <section className="border-y border-outline-variant bg-surface-container-low">
          <div className="max-w-[1280px] mx-auto px-container-padding md:px-lg py-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center">
              <div className="flex flex-col items-center">
                <Leaf className="text-secondary mb-2" size={24} />
                <span className="font-label-md text-label-md text-on-surface">
                  100% Naturel
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Rabbit className="text-secondary mb-2" size={24} />
                <span className="font-label-md text-label-md text-on-surface">
                  Cruelty Free
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Recycle className="text-secondary mb-2" size={24} />
                <span className="font-label-md text-label-md text-on-surface">
                  Éco-responsable
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="text-secondary mb-2" size={24} />
                <span className="font-label-md text-label-md text-on-surface">
                  Fait avec amour
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* "Nos Essentiels" Product Grid */}
        <section className="py-xl max-w-[1280px] mx-auto px-container-padding md:px-lg animate-fade-in" id="essentiels">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
              Nos Essentiels
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Une sélection minutieuse d&apos;ingrédients bruts et précieux pour nourrir, hydrater et fortifier votre couronne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-surface-container-lowest border border-surface-variant rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(51,69,13,0.08)]"
              >
                <Link href={`/catalogue/${product.id}`} className="relative h-64 bg-surface-container p-4 flex items-center justify-center overflow-hidden cursor-pointer">
                  <img
                    className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
                    src={product.image}
                    alt={product.name}
                  />
                </Link>
                <div className="p-md flex flex-col flex-grow">
                  <Link href={`/catalogue/${product.id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-caption text-caption text-on-surface-variant mb-md flex-grow">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-label-md text-label-md text-on-surface">
                      {product.priceEur.toFixed(2)} €
                    </span>
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
            ))}
          </div>

          <div className="mt-lg text-center">
            <a
              className="inline-flex items-center text-primary font-label-md text-label-md hover:text-secondary transition-colors duration-300 border-b border-primary hover:border-secondary pb-1 cursor-pointer"
              href="/catalogue"
            >
              Voir tout le catalogue
              <ArrowRight className="ml-1" size={14} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
