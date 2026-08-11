"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryZone,
    shippingCost,
    total,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto px-container-padding py-20 text-center space-y-md md:mt-16 bg-surface rounded-xl border border-surface-variant/40 my-10">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40">
          shopping_bag
        </span>
        <h2 className="font-serif text-headline-md text-primary">Votre panier est vide</h2>
        <p className="font-sans text-body-md text-on-surface-variant max-w-sm mx-auto">
          Découvrez nos soins botaniques malgaches et commencez votre rituel beauté.
        </p>
        <Link href="/products" className="inline-block mt-4">
          <button className="bg-primary text-on-primary font-sans font-semibold text-label-md px-8 py-3 rounded-full hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
            Découvrir nos soins
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-container-padding py-md md:mt-16 bg-surface">
      {/* Page Title */}
      <div className="text-center mb-lg">
        <h1 className="font-serif text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
          Mon Panier
        </h1>
        <p className="font-sans text-body-md text-on-surface-variant">
          Vérifiez vos articles avant de valider votre commande.
        </p>
      </div>

      {/* Cart Items List */}
      <section className="space-y-sm mb-lg">
        {cartItems.map((item) => (
          <article
            key={item.product.id}
            className="flex items-center gap-sm bg-surface p-sm rounded-xl border border-[#E0D7CC] hover:shadow-sm transition-all"
          >
            {/* Product Thumbnail */}
            <div className="w-20 h-20 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-container-highest">
              <Image
                fill
                sizes="80px"
                alt={item.product.name}
                src={item.product.image}
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-sans font-semibold text-body-md text-on-surface truncate">
                {item.product.name}
              </h3>
              <p className="font-sans text-caption text-on-surface-variant truncate mb-2">
                {item.product.concern}
              </p>
              
              {/* Quantity Selector (mobile friendly) */}
              <div className="flex items-center border border-[#E0D7CC] rounded-full w-max px-1.5 py-0.5 bg-surface-container-low">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  aria-label="Diminuer la quantité"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-6 text-center font-sans font-semibold text-caption">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  aria-label="Augmenter la quantité"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>

            {/* Price & Delete */}
            <div className="flex flex-col items-end gap-sm flex-shrink-0">
              <span className="font-sans font-semibold text-label-md text-primary">
                {(item.product.price * item.quantity).toLocaleString("fr-FR")} Ar
              </span>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-on-surface-variant hover:text-error transition-colors p-1.5 cursor-pointer rounded-full hover:bg-surface-container"
                aria-label="Supprimer l'article"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Order Summary & Actions */}
      <section className="bg-surface-container p-md rounded-xl space-y-md">
        <h3 className="font-serif text-headline-md-mobile text-primary">Résumé de la commande</h3>
        
        <div className="space-y-xs font-sans text-body-md text-on-surface-variant border-b border-outline-variant/30 pb-md">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span className="font-semibold text-on-surface">
              {subtotal.toLocaleString("fr-FR")} Ar
            </span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span className="font-semibold text-on-surface">
              {deliveryZone
                ? `${shippingCost.toLocaleString("fr-FR")} Ar`
                : "Calculé à l'étape suivante"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center font-serif text-headline-md-mobile text-primary">
          <span>Total estimé</span>
          <span>{total.toLocaleString("fr-FR")} Ar</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-sm space-y-sm">
          <Link href="/checkout" className="block w-full">
            <button className="w-full bg-primary text-on-primary py-4 rounded-full font-sans font-semibold text-label-md flex justify-center items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-[0_4px_14px_0_rgba(51,69,13,0.25)] cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Procéder à la livraison
            </button>
          </Link>
          
          <Link href="/products" className="block w-full text-center">
            <button className="w-full bg-transparent border border-primary text-primary py-3 rounded-full font-sans font-semibold text-label-md flex justify-center items-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Continuer mes achats
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
