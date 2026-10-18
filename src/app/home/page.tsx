"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/types";
import { getDbProducts } from "@/data/queries";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Leaf, Rabbit, Recycle, Heart, ShoppingCart } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    getDbProducts().then(setDbProducts);
  }, []);

  const homeProductIds = ["ricin-bio", "coco-mask", "brume-fresh", "serum-baobab"];
  
  const featuredProducts = useMemo(() => {
    const filtered = dbProducts.filter((p) => homeProductIds.includes(p.id));
    if (filtered.length > 0) return filtered;
    return dbProducts.slice(0, 4);
  }, [dbProducts]);

  const handleAddToCart = (product: Product) => {
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
            <ScrollReveal direction="up" delay={150}>
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
            </ScrollReveal>
          </div>
        </section>

        {/* Features / Trust Bar */}
        <section className="border-y border-outline-variant bg-surface-container-low">
          <div className="max-w-[1280px] mx-auto px-container-padding md:px-lg py-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center">
              {[
                { icon: Leaf, label: "100% Naturel" },
                { icon: Rabbit, label: "Cruelty Free" },
                { icon: Recycle, label: "Éco-responsable" },
                { icon: Heart, label: "Fait avec amour" },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <ScrollReveal key={item.label} direction="up" delay={idx * 100}>
                    <div className="flex flex-col items-center">
                      <IconComponent className="text-secondary mb-2" size={24} />
                      <span className="font-label-md text-label-md text-on-surface">
                        {item.label}
                      </span>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* "Nos Essentiels" Product Grid */}
        <section className="py-xl max-w-[1280px] mx-auto px-container-padding md:px-lg" id="essentiels">
          <ScrollReveal direction="down">
            <div className="text-center mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
                Nos Essentiels
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Une sélection minutieuse d&apos;ingrédients bruts et précieux pour nourrir, hydrater et fortifier votre couronne.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
            {featuredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} direction="up" delay={idx * 120}>
                <div className="h-full group flex flex-col bg-surface-container-lowest border border-surface-variant rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(51,69,13,0.08)]">
                  <div className="relative h-64 overflow-hidden">
                    <Link href={`/catalogue/${product.id}`} className="absolute inset-0 cursor-pointer">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={product.image}
                        alt={product.name}
                      />
                    </Link>
                  </div>
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
                        {product.priceAr.toLocaleString()} Ar
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
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={200}>
            <div className="mt-lg text-center">
              <a
                className="inline-flex items-center text-primary font-label-md text-label-md hover:text-secondary transition-colors duration-300 border-b border-primary hover:border-secondary pb-1 cursor-pointer"
                href="/catalogue"
              >
                Voir tout le catalogue
                <ArrowRight className="ml-1" size={14} />
              </a>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
