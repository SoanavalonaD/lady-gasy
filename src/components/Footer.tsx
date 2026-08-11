"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-surface-container py-12 px-container-padding border-t border-outline-variant/30 text-on-surface">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg">
        {/* Brand & Story */}
        <div className="space-y-4 md:col-span-2">
          <h2 className="font-serif text-headline-md text-primary">Lady Gasy</h2>
          <p className="font-sans text-body-md text-on-surface-variant max-w-md">
            Célébrer la beauté naturelle à travers le prisme de l'authenticité et de l'expertise botanique malgache. Des soins premium, naturels et éco-responsables.
          </p>
        </div>

        {/* Navigation links */}
        <div className="space-y-4">
          <h3 className="font-sans font-semibold text-label-md text-primary uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-2 font-sans text-body-md text-on-surface-variant">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-primary transition-colors">Boutique</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-primary transition-colors">Mon Panier</Link>
            </li>
            <li>
              <Link href="/#story" className="hover:text-primary transition-colors">Notre Histoire</Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <h3 className="font-sans font-semibold text-label-md text-primary uppercase tracking-wider">Contact &amp; Adresse</h3>
          <ul className="space-y-2 font-sans text-body-md text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
              <span>Antananarivo, Madagascar</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">phone</span>
              <span>+261 34 00 000 00</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">mail</span>
              <span>contact@ladygasy.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 text-caption text-on-surface-variant font-sans">
        <p>&copy; {new Date().getFullYear()} Lady Gasy. Tous droits réservés.</p>
        <p>Conçu avec soin pour la beauté au naturel.</p>
      </div>
    </footer>
  );
};
