"use client";

import React, { useState, useEffect, use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getDbProducts } from "@/data/db";
import Link from "next/link";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  CheckCircle2,
  ChevronDown,
  ArrowRight
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    getDbProducts().then((data) => {
      setDbProducts(data);
      setLoading(false);
    });
  }, []);

  const product = dbProducts.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

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

  const mainImage = product.image;
  const secondaryImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCcERwwHRgWt8gtoGrI0Q-o7Y35sInX_5DbU4s8KaQ6BPaiCkqjesfdemHzEJA5UUn7c-1svzeBN8pd7x3KCUfIUY5rj-Ml9I25y_4-lbyS3ahjUCnLUw7m-FMEa9SgGFcQkSZbr9g0bxjr55yywehsX_-CGaEVXEiPdjHd-Mcz0hZzniYgsb-JqDpXsnBajsKZebwR8FwHou_ahg6u_Tqqzr8mFwEKz0exlMYzmby2cKhFnQxelq3EBo56Gbz9d5dKMQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD1wJDInvUoQr0Z9lGQHsOqOOaYJaYD53J7MtUrxHO9o-FlecURvn8tHevBLzRHcH0UJ-Y6lyWVp7bQ1KUkkK0-h5nrHSbUm1qcuejaebKNXODcIlK2i88YSJ0h-87d-KZ5vPb3H_0GJ98W87uFRhPx0lWeuvkRTYRTSaS0SJUhT1VLoD-l3pdF4cpIawBJOIBNg7IkMCnNYzKIb9wv56FOsgkBXYcB6C0pPwFfHSY89CCEJzKrklFU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDlBRdoePzyo7Ceh1F4TuN-MurMfxq0b8Ouw3z7z3bzKQxU6DwVZ4LmIPZidMyhnggoz4fJsCujQ21BIfL6K9EtSMsIlH5LSjbn-7cIdLUcqbDcQgkigFtnwdWvE2IqdXIQh0swbFntDjJ3C8MnYz0WqfLlI4bkkCUGIKwdD0V8SLSvq2Na0LVku4odpmKKhC4Wjny7Ga55lrDCV03WYobPuTkG4DXVcZK1liekHZUPqjLWWNw9HiOt"
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setToastMessage(`"${product.name}" a été ajouté au panier !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Build breadcrumbs
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
          {/* Image Gallery */}
          <div className="md:col-span-6 flex flex-col gap-sm">
            <div className="aspect-[2/3] w-full relative rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/30">
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                src={activeImage || mainImage}
              />
            </div>
            <div className="grid grid-cols-4 gap-sm">
              <div
                onClick={() => setActiveImage(mainImage)}
                className={`aspect-square rounded-lg overflow-hidden bg-surface-container-low border cursor-pointer ${
                  (activeImage || mainImage) === mainImage ? "border-primary" : "border-transparent"
                }`}
              >
                <img alt={product.name} className="w-full h-full object-cover" src={mainImage} />
              </div>
              {secondaryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden bg-surface-container-low border transition-colors cursor-pointer ${
                    activeImage === img ? "border-primary" : "border-transparent hover:border-primary/20"
                  }`}
                >
                  <img alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" src={img} />
                </div>
              ))}
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
                  {product.priceEur.toFixed(2)} Ar
                </span>
                <span className="text-on-surface-variant font-body-md text-body-md line-through">
                  {(product.priceEur * 1.3).toFixed(2)} Ar
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
              <p>{product.description}. Un soin précieux formulé pour nourrir intensément et réparer les cheveux texturés, crépus, bouclés ou abîmés. Infusée aux herbes botaniques naturelles, cette formule légère pénètre rapidement pour sceller l&apos;hydratation, apporter de la brillance et fortifier la fibre capillaire sans l&apos;alourdir. Idéal pour votre routine capillaire saine.</p>
            </div>

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
