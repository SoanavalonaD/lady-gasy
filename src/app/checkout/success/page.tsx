"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShoppingBasket } from "lucide-react";

interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  total: number;
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const lastOrder = sessionStorage.getItem("lastOrder");
    if (lastOrder) {
      try {
        const parsed = JSON.parse(lastOrder);
        setTimeout(() => setOrder(parsed), 0);
      } catch (e) {
        console.error("Failed to parse last order details", e);
      }
    }
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col pt-[88px]">
      {/* Simplified Header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm py-md px-lg flex justify-center items-center">
        <Link href="/" className="font-display-lg text-display-lg text-primary italic hover:text-secondary transition-colors">
          Lady Gasy
        </Link>
      </header>

      <main className="flex-grow w-full max-w-[600px] mx-auto px-lg py-xl flex flex-col items-center justify-center text-center">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-md w-full relative overflow-hidden group">
          {/* Decorative organic green circle backdrop */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>

          {/* Success Check Icon */}
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md animate-bounce">
            <Check className="text-on-primary-container font-bold" size={36} />
          </div>

          <h1 className="font-display-lg text-headline-lg text-primary mb-sm">
            Merci pour votre commande !
          </h1>
          <p className="font-body-md text-on-surface-variant mb-lg">
            Votre commande a été enregistrée avec succès. Notre équipe va la préparer et vous contactera par téléphone avant la livraison.
          </p>

          {order && (
            <div className="bg-surface-container p-md rounded-xl text-left space-y-md border border-outline-variant mb-lg font-body-md text-sm">
              <h2 className="font-label-md text-primary border-b border-outline-variant pb-xs uppercase tracking-wider font-semibold">
                Détails de la livraison
              </h2>
              <div>
                <p className="text-on-surface-variant font-medium">Destinataire :</p>
                <p className="text-on-surface">{order.name}</p>
              </div>
              <div>
                <p className="text-on-surface-variant font-medium">Adresse de livraison :</p>
                <p className="text-on-surface">{order.address}</p>
              </div>
              <div>
                <p className="text-on-surface-variant font-medium">Téléphone :</p>
                <p className="text-on-surface">{order.phone}</p>
              </div>
              <div className="border-t border-outline-variant/60 pt-sm flex justify-between items-center text-base">
                <span className="font-bold text-primary">Montant total à payer :</span>
                <span className="font-bold text-primary text-lg">
                  {order.total.toLocaleString()} Ar
                </span>
              </div>
              <p className="text-xs text-secondary italic text-center font-medium mt-xs">
                * Mode de règlement : Espèces à la livraison. Veuillez préparer la somme exacte.
              </p>
            </div>
          )}

          <div className="space-y-sm">
            <Link
              href="/catalogue"
              className="w-full bg-primary hover:bg-surface-tint text-on-primary py-md rounded-md font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-sm cursor-pointer shadow-sm hover:shadow-md"
            >
              Continuer mes achats
              <ShoppingBasket size={18} />
            </Link>
            <Link
              href="/"
              className="w-full text-primary hover:text-secondary font-label-md py-sm block transition-all"
            >
              Retourner à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="w-full mt-xl bg-tertiary-fixed border-t border-outline-variant py-xl">
        <div className="max-w-[1280px] mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="font-headline-md text-headline-md text-primary block">Lady Gasy</span>
          <p className="font-caption text-caption text-on-tertiary-fixed-variant text-center md:text-left">
            © {new Date().getFullYear()} Lady Gasy. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
