"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Lock } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotalAr, totalItems } =
    useCart();

  return (
    <>
      <Header />
      <main className="flex-grow pt-[104px] pb-xl max-w-[1280px] mx-auto w-full px-container-padding md:px-lg">
        {/* Title */}
        <div className="mb-lg mt-md">
          <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary mb-base">
            Votre Panier
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {totalItems} {totalItems > 1 ? "articles" : "article"} dans votre commande.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="text-center py-xl bg-surface-container-low rounded-xl border border-outline-variant/30 mx-auto my-lg flex flex-col items-center">
            <ShoppingCart className="text-primary mb-md" size={48} />
            <h2 className="font-headline-md text-primary mb-sm">
              Votre panier est vide
            </h2>
            <p className="font-body-md text-on-surface-variant mb-lg px-md">
              Découvrez notre gamme de soins botaniques formulés pour sublimer vos cheveux texturés et faites votre choix.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
              <Link
                href="/catalogue"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-on-primary font-label-md px-lg py-md rounded-md hover:bg-surface-tint transition-all duration-300 shadow-sm"
              >
                Découvrir nos produits
              </Link>

              <Link
                href="/commandes"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-surface-container-high border border-outline-variant/60 text-primary hover:bg-surface-container-highest font-label-md px-lg py-md rounded-md transition-all duration-300 shadow-sm"
              >
                Consulter mes commandes
              </Link>
            </div>
          </div>
        ) : (
          /* Grid Content */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Items List (Left Column) */}
            <div className="lg:col-span-8 space-y-md">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-md py-md border-b border-surface-variant"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant/30 relative">
                    <img
                      className="object-contain w-full h-full p-2"
                      src={item.product.image}
                      alt={item.product.name}
                    />
                  </div>

                  {/* Product Details & Controls */}
                  <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                    <div>
                      <h3 className="font-headline-md text-body-lg text-on-surface mb-xs">
                        {item.product.name}
                      </h3>
                      <p className="font-caption text-caption text-on-surface-variant">
                        {item.product.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-lg">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-outline rounded-DEFAULT px-sm py-xs bg-surface-container-lowest">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-on-surface hover:text-primary transition-colors flex items-center justify-center"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-label-md text-label-md px-md w-8 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-on-surface hover:text-primary transition-colors flex items-center justify-center"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      {/* Total Price for item */}
                      <div className="font-label-md text-label-md text-on-surface w-24 text-right">
                        {(item.product.priceAr * item.quantity).toLocaleString()} Ar
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Supprimer ${item.product.name} du panier`}
                        className="text-on-surface-variant hover:text-error transition-colors p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg sticky top-[120px] shadow-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface border-b border-surface-variant pb-sm mb-md">
                  Résumé
                </h2>
                <div className="space-y-sm mb-lg">
                  <div className="flex justify-between font-body-md text-body-md text-on-surface">
                    <span>Sous-total</span>
                    <span>{subtotalAr.toLocaleString()} Ar</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Livraison estimée</span>
                    <span className="italic">Calculé à l&apos;étape suivante</span>
                  </div>
                </div>
                <div className="flex justify-between font-body-lg text-body-lg text-on-surface font-bold border-t border-surface-variant pt-md mb-xl">
                  <span>Total</span>
                  <span>{subtotalAr.toLocaleString()} Ar</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md py-md rounded-DEFAULT transition-colors duration-200 flex items-center justify-center gap-sm cursor-pointer shadow-sm hover:shadow-md"
                >
                  Procéder à la commande
                  <ArrowRight size={18} />
                </Link>

                <p className="font-caption text-caption text-center text-on-surface-variant mt-sm flex items-center justify-center gap-xs">
                  <Lock size={16} />
                  Paiement sécurisé
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
