"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { products, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const CatalogueContent = () => {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Sync category state with search query param (e.g. from sidebar links)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("Tous");
    }
  }, [searchParams]);

  // Categories list
  const categories = ["Tous", "Hydratation", "Volume & Boucles", "Accessoires"];

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "Tous") return true;
    return product.category === selectedCategory;
  });

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, qty: number) => {
    addToCart(product, qty);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
    handleCloseModal();
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="w-full max-w-7xl mx-auto px-container-padding py-md md:mt-16 bg-surface">
      {/* Toast Notification for Add to Cart */}
      {addedProductId && (
        <div className="fixed bottom-20 right-4 z-[110] bg-primary text-on-primary px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span className="font-sans font-medium text-body-md">Ajouté au panier !</span>
        </div>
      )}

      {/* Filter Chips Bar */}
      <section className="mb-md overflow-x-auto whitespace-nowrap scrollbar-hide py-2">
        <div className="flex gap-sm">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-sans text-label-md transition-all duration-300 cursor-pointer ${
                selectedCategory === category
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container border border-[#E0D7CC] text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter gap-y-lg mb-xl">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            onClick={() => handleOpenModal(product)}
            className="bg-surface rounded-lg border border-[#E0D7CC] overflow-hidden flex flex-col group cursor-pointer transition-transform hover:-translate-y-1"
          >
            <div className="w-full aspect-[4/5] bg-surface-container-high relative">
              <Image
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="w-full h-full object-cover"
                alt={product.name}
                src={product.image}
              />
              {product.isNew && (
                <div className="absolute top-2 left-2 bg-secondary text-on-secondary px-2 py-1 rounded-sm font-sans text-[10px] font-bold uppercase tracking-wider">
                  Nouveau
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-serif text-headline-md-mobile text-on-surface mb-1 leading-tight group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="font-sans text-caption text-on-surface-variant mb-3 flex-grow">
                {product.concern}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-sans font-semibold text-label-md text-primary">
                  {product.price.toLocaleString("fr-FR")} Ar
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product, 1);
                  }}
                  aria-label="Ajouter au panier"
                  className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-tertiary/40 backdrop-blur-[15px] flex items-end sm:items-center justify-center transition-opacity">
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-default" onClick={handleCloseModal} />

          {/* Modal / Bottom Sheet */}
          <div className="relative bg-surface w-full sm:w-[480px] sm:max-h-[90vh] sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col shadow-2xl h-[85vh] sm:h-auto z-10 animate-slide-up sm:animate-fade-in">
            {/* Mobile Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full"></div>
            </div>

            {/* Product Image */}
            <div className="relative w-full aspect-square bg-surface-container-highest flex-shrink-0">
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface hover:text-primary z-10 transition-colors cursor-pointer"
                onClick={handleCloseModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <Image
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                alt={selectedProduct.name}
                src={selectedProduct.detailsImage || selectedProduct.image}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Body */}
            <div className="p-container-padding flex-grow overflow-y-auto bg-surface relative">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-serif text-headline-lg-mobile text-on-surface pr-4">
                  {selectedProduct.name}
                </h2>
                <span className="font-serif text-[20px] text-primary whitespace-nowrap">
                  {selectedProduct.price.toLocaleString("fr-FR")} Ar
                </span>
              </div>
              <p className="font-sans text-caption text-on-surface-variant mb-6 uppercase tracking-widest border-b border-[#E0D7CC] pb-4">
                Pour {selectedProduct.concern.toLowerCase()}
              </p>
              <div className="font-sans text-body-md text-on-surface-variant space-y-4 mb-xl">
                <p>{selectedProduct.description}</p>
                {selectedProduct.features && (
                  <ul className="list-none space-y-2 pt-2">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <span className="material-symbols-outlined text-primary mr-2 text-[18px]">
                          eco
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="p-4 bg-surface border-t border-[#E0D7CC] flex gap-sm items-center z-10 flex-shrink-0">
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#E0D7CC] rounded-full px-2 py-1 bg-surface-container-low">
                <button
                  onClick={decrementQty}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="w-8 text-center font-sans font-semibold text-body-md">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(selectedProduct, quantity)}
                className="flex-grow bg-primary text-on-primary py-3 px-6 rounded-full font-sans font-semibold text-label-md flex justify-center items-center gap-2 hover:bg-primary-container transition-all cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-sans">Chargement de la boutique...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
