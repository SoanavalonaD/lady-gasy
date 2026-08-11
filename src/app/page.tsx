"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filter the essentials shown on the homepage
  const essentialIds = ["huile-ricin", "masque-coco", "brume-aloe"];
  const essentials = products.filter((p) => essentialIds.includes(p.id));

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:mt-16 bg-surface">
      {/* Toast Notification for Add to Cart */}
      {addedProductId && (
        <div className="fixed bottom-20 right-4 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce transition-all">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span className="font-sans font-medium text-body-md">Ajouté au panier !</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            priority
            alt="Naturelle Elégance Hero background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoi-IL8Q5-rO8t290aL8LDFubQIsMyuyfkAcxOs8e4KpPZK2rbxJpVCPD5bGREhmHQA5CccVPnKZQKUUHNNq9ICCj4zVm8YEhcPzoFXtB3E7JT4dxXEKNaVTS7iiZJaNxJ_Ed1htoxaqVFNT9i5ZlH1Zetd1I_xZ02RKcOUe4nKgz-7AWGm6Zbmz-8B7zpGNJK4VcBOI8tAWQ5nF9ztiK4I20YPLDcneoyuCxwLDWzR7nQJLpirlvcpsBu0Fz7Tl28Jg"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-surface/20"></div>
        </div>
        <div className="relative z-10 text-center px-container-padding max-w-2xl mx-auto flex flex-col items-center gap-sm">
          <h2 className="font-serif text-headline-lg-mobile md:text-display-lg text-primary drop-shadow-md">
            Un havre de beauté naturelle
          </h2>
          <p className="font-sans text-body-lg text-on-surface mb-md">
            Découvrez l'expertise botanique malgache pour sublimer vos boucles naturelles.
          </p>
          <Link href="/products">
            <button className="bg-primary text-on-primary font-sans font-semibold text-label-md px-8 py-3 rounded-full hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
              Découvrir nos produits
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-xl px-container-padding max-w-5xl mx-auto">
        <div className="text-center mb-lg">
          <h3 className="font-serif text-headline-md text-primary mb-2">Nos Essentiels</h3>
          <p className="font-sans text-body-md text-on-surface-variant">
            Les soins favoris pour vos rituels de beauté.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {essentials.map((product) => (
            <div
              key={product.id}
              className="bg-surface-container-lowest border border-surface-variant rounded-lg overflow-hidden group hover:shadow-[0_4px_20px_rgba(51,69,13,0.1)] transition-all duration-300 flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative">
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={product.name}
                  src={product.image}
                />
              </div>
              <div className="p-sm flex flex-col gap-1 flex-grow">
                <h4 className="font-serif text-[18px] leading-snug text-on-surface">
                  {product.name}
                </h4>
                <p className="font-sans text-caption text-on-surface-variant mb-2">
                  {product.concern}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-sans font-semibold text-label-md text-primary">
                    {product.price.toLocaleString("fr-FR")} Ar
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label="Ajouter au panier"
                    className="text-primary hover:text-secondary transition-colors p-2 cursor-pointer focus:outline-none"
                  >
                    <span className="material-symbols-outlined block" style={{ fontVariationSettings: "'FILL' 1" }}>
                      add_circle
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="story" className="py-xl px-container-padding bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-lg">
          <div className="w-full md:w-1/2 h-80 relative rounded-2xl overflow-hidden shadow-sm">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Botanical raw ingredients"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw01ekYz400SzCZi78Lj4rZu8M-bYkZYzsGTc5t6VNh2i_r1ehJwlFARlQbrUkZjh1ZF1-jYBY6AGeZ8ZBYa6RvGGwPCNeJHKu0gbZHNef5f_RZZW9ODl9bh-b4sa4fCsePVzW_9-sJKLugt-dXNwfzNyvfBqvjJ_cUHDkD8SH2kzHS1cvxGXDq-FNUBl1G7xYSIyAUufTdZqk0qIH1yDHyxP9_HP2jWqt0pVdt0_8GGGpppqHItzHUe33PAn2gqlWiw"
              className="object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-md">
            <h3 className="font-serif text-headline-md text-primary">Notre Histoire</h3>
            <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
              Inspirée des rituels ancestraux de Madagascar, Lady Gasy unit la richesse de la biodiversité malgache aux exigences de la cosmétique moderne. 
            </p>
            <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
              Nous collaborons directement avec des producteurs locaux pour extraire des huiles végétales de première qualité (Baobab, Ricin, Karité), garantissant des soins purs, éthiques et hautement nutritifs pour les cheveux ondulés, bouclés, frisés et crépus.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
