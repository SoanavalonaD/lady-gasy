"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, DeliveryZone, ZONE_PRICES, ZONE_LABELS } from "@/context/CartContext";

export default function CheckoutPage() {
  const {
    cartItems,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    shippingCost,
    total,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    ville: "Antananarivo",
    codepostal: "101",
    adresse: "",
    repere: "",
  });

  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeliveryZone(e.target.value as DeliveryZone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryZone) {
      alert("Veuillez sélectionner une zone de livraison.");
      return;
    }
    
    // Generate a random order ID
    const randomId = "LG-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setIsOrdered(true);
    
    // Clear cart items upon successful order placing
    clearCart();
  };

  // If order was placed successfully, show confirmation screen
  if (isOrdered) {
    return (
      <div className="w-full max-w-md mx-auto px-container-padding py-xl text-center space-y-md md:mt-16 bg-surface rounded-2xl border border-[#E0D7CC] my-10 shadow-lg">
        <span className="material-symbols-outlined text-[64px] text-primary">
          check_circle
        </span>
        <h2 className="font-serif text-headline-md text-primary">Commande validée !</h2>
        <div className="bg-surface-container p-sm rounded-xl text-left space-y-xs font-sans text-body-md text-on-surface-variant">
          <p className="text-center font-bold text-primary mb-2">Récapitulatif de commande</p>
          <p><strong>N° de commande :</strong> {orderId}</p>
          <p><strong>Destinataire :</strong> {formData.nom}</p>
          <p><strong>Téléphone :</strong> {formData.telephone}</p>
          <p><strong>Livraison :</strong> {ZONE_LABELS[deliveryZone]}</p>
          <p><strong>Adresse :</strong> {formData.adresse}, {formData.ville}</p>
          <p className="border-t border-outline-variant/30 pt-xs mt-xs text-primary font-bold">
            Paiement à la livraison
          </p>
        </div>
        <p className="font-sans text-caption text-on-surface-variant max-w-sm mx-auto">
          Notre équipe va vous contacter par téléphone pour confirmer la livraison. Merci de votre confiance !
        </p>
        <Link href="/" className="inline-block w-full">
          <button className="w-full bg-primary text-on-primary py-4 rounded-full font-sans font-semibold text-label-md hover:bg-primary-container transition-all shadow-md cursor-pointer">
            Retour à l'accueil
          </button>
        </Link>
      </div>
    );
  }

  // If cart is empty (e.g. if page is refreshed after placing order)
  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto px-container-padding py-20 text-center space-y-md md:mt-16 bg-surface rounded-xl border border-surface-variant/40 my-10">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40">
          shopping_cart
        </span>
        <h2 className="font-serif text-headline-md text-primary">Votre panier est vide</h2>
        <p className="font-sans text-body-md text-on-surface-variant max-w-sm mx-auto">
          Vous devez avoir des articles dans votre panier pour procéder à la validation.
        </p>
        <Link href="/products" className="inline-block mt-4">
          <button className="bg-primary text-on-primary font-sans font-semibold text-label-md px-8 py-3 rounded-full hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
            Voir la boutique
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-container-padding py-md md:mt-16 bg-surface">
      {/* Header and subtitle */}
      <div className="text-center mb-lg">
        <h1 className="font-serif text-headline-lg-mobile text-primary mb-xs">
          Validation
        </h1>
        <p className="font-sans text-body-md text-on-surface-variant">
          Finalisez votre commande en toute sécurité.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* 1. Identification section */}
        <section className="bg-surface p-md rounded-xl border border-[#E0D7CC]">
          <h2 className="font-serif text-headline-md text-primary mb-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">person</span>
            Identification
          </h2>
          <div className="flex flex-col gap-sm">
            <button
              type="button"
              onClick={() => alert("Connexion indisponible dans cette maquette.")}
              className="w-full bg-primary text-on-primary py-3 rounded-md font-sans font-semibold text-label-md flex justify-center items-center gap-2 hover:bg-primary-container transition-colors cursor-pointer"
            >
              Connexion
            </button>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink-0 mx-4 text-on-surface-variant font-sans text-caption">OU</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            <button
              type="button"
              onClick={() => alert("Inscription indisponible dans cette maquette.")}
              className="w-full bg-transparent border border-secondary text-secondary py-3 rounded-md font-sans font-semibold text-label-md flex justify-center items-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              Créer un compte
            </button>
          </div>
          <p className="font-sans text-caption text-on-surface-variant mt-sm text-center">
            Poursuivez en remplissant le formulaire ci-dessous.
          </p>
        </section>

        {/* 2. Coordonnées section */}
        <section className="bg-surface p-md rounded-xl border border-[#E0D7CC]">
          <h2 className="font-serif text-headline-md text-primary mb-md flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">contact_mail</span>
            Mes Coordonnées
          </h2>
          <div className="space-y-md">
            <div className="flex flex-col">
              <label className="font-sans font-semibold text-label-md text-on-surface mb-xs" htmlFor="nom">
                Nom Complet *
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface font-sans"
                id="nom"
                name="nom"
                placeholder="Jane Doe"
                required
                type="text"
                value={formData.nom}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-sans font-semibold text-label-md text-on-surface mb-xs" htmlFor="telephone">
                Numéro de Téléphone *
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface font-sans"
                id="telephone"
                name="telephone"
                placeholder="+261 34 00 000 00"
                required
                type="tel"
                value={formData.telephone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* 3. Livraison section */}
        <section className="bg-surface p-md rounded-xl border border-[#E0D7CC]">
          <h2 className="font-serif text-headline-md text-primary mb-md flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">local_shipping</span>
            Livraison
          </h2>
          <div className="space-y-md">
            <div className="flex flex-col">
              <label className="font-sans font-semibold text-label-md text-on-surface mb-xs" htmlFor="zone">
                Zone de livraison *
              </label>
              <select
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface appearance-none font-sans cursor-pointer"
                id="zone"
                name="zone"
                required
                value={deliveryZone}
                onChange={handleZoneChange}
              >
                <option value="" disabled>Sélectionnez votre zone</option>
                <option value="zone1">Zone 1 (Centre-ville) - 4 000 Ar</option>
                <option value="zone2">Zone 2 (Périphérie proche) - 6 000 Ar</option>
                <option value="zone3">Zone 3 (Périphérie lointaine) - 8 000 Ar</option>
                <option value="zone4">Zone 4 (Banlieue) - 10 000 Ar</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col">
                <label className="font-sans font-semibold text-label-md text-on-surface mb-xs" htmlFor="ville">
                  Ville *
                </label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface font-sans"
                  id="ville"
                  name="ville"
                  placeholder="Antananarivo"
                  required
                  type="text"
                  value={formData.ville}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="font-sans font-semibold text-label-md text-on-surface mb-xs" htmlFor="codepostal">
                  Code Postal
                </label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface font-sans"
                  id="codepostal"
                  name="codepostal"
                  placeholder="101"
                  type="text"
                  value={formData.codepostal}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-sans font-semibold text-label-md text-on-surface mb-xs" htmlFor="adresse">
                Adresse détaillée *
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface font-sans"
                id="adresse"
                name="adresse"
                placeholder="Lot II M 34 Bis..."
                required
                type="text"
                value={formData.adresse}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-sans font-semibold text-label-md text-on-surface mb-xs" htmlFor="repere">
                Repère exact pour le livreur *
              </label>
              <textarea
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface resize-none font-sans"
                id="repere"
                name="repere"
                placeholder="Portail vert, en face de l'épicerie..."
                required
                rows={3}
                value={formData.repere}
                onChange={handleInputChange}
              />
              <p className="font-sans text-caption text-on-surface-variant mt-xs">
                Aidez notre livreur à vous trouver facilement.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Résumé de la commande */}
        <section className="bg-surface-container p-md rounded-xl space-y-md">
          <h3 className="font-serif text-headline-md-mobile text-primary">Résumé de la commande</h3>
          
          {/* Items Summary list */}
          <div className="space-y-sm mb-md pb-md border-b border-outline-variant/30">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center gap-sm">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest relative">
                  <Image
                    fill
                    sizes="64px"
                    alt={item.product.name}
                    src={item.product.image}
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-sans font-semibold text-label-md text-on-surface truncate">
                    {item.product.name}
                  </h4>
                  <p className="font-sans text-caption text-on-surface-variant">
                    Qte: {item.quantity}
                  </p>
                </div>
                <div className="font-sans font-semibold text-label-md text-on-surface flex-shrink-0">
                  {(item.product.price * item.quantity).toLocaleString("fr-FR")} Ar
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-xs font-sans text-body-md text-on-surface-variant">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-semibold text-on-surface">
                {subtotal.toLocaleString("fr-FR")} Ar
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span className="font-semibold text-on-surface">
                {deliveryZone
                  ? `${shippingCost.toLocaleString("fr-FR")} Ar`
                  : "--"}
              </span>
            </div>
          </div>

          <div className="mt-md pt-sm border-t border-outline-variant/30 flex justify-between font-serif text-headline-md-mobile text-primary">
            <span>Total</span>
            <span>{total.toLocaleString("fr-FR")} Ar</span>
          </div>
        </section>

        {/* 5. Validation Button */}
        <div className="pt-sm pb-xl">
          <button
            type="submit"
            className="w-full bg-primary text-on-primary py-4 rounded-full font-sans font-semibold text-label-md flex justify-center items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-[0_4px_14px_0_rgba(51,69,13,0.39)] cursor-pointer"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Valider la commande (Paiement à la livraison)
          </button>
          <p className="font-sans text-caption text-center text-on-surface-variant mt-sm flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Vos données sont sécurisées
          </p>
        </div>
      </form>
    </div>
  );
}
