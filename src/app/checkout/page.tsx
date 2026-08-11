"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotalAr, clearCart } = useCart();

  // Form State
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [zone, setZone] = useState("");
  const [ville, setVille] = useState("");
  const [cp, setCp] = useState("");
  const [adresse, setAdresse] = useState("");
  const [repere, setRepere] = useState("");
  
  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Compute shipping fee based on selected zone
  const getShippingFee = () => {
    switch (zone) {
      case "antananarivo_centre":
        return 5000;
      case "antananarivo_peripherie":
        return 10000;
      case "province":
        return 20000;
      default:
        return 0;
    }
  };

  const shippingFee = getShippingFee();
  const totalAr = subtotalAr + shippingFee;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim() || !email.includes("@")) newErrors.email = "Adresse email valide requise";
    if (!prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!nom.trim()) newErrors.nom = "Nom requis";
    if (!telephone.trim()) newErrors.telephone = "Téléphone requis";
    if (!zone) newErrors.zone = "Zone de livraison requise";
    if (!ville.trim()) newErrors.ville = "Ville requise";
    if (!adresse.trim()) newErrors.adresse = "Adresse de livraison requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Success! Clear the cart and redirect
    const orderDetails = {
      name: `${prenom} ${nom}`,
      email,
      phone: telephone,
      address: `${adresse}, ${ville} (${zone.replace("_", " ")})`,
      total: totalAr,
    };

    // Store in session storage to display on success page
    sessionStorage.setItem("lastOrder", JSON.stringify(orderDetails));
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col pt-[88px]">
      {/* Simplified checkout header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm py-md px-lg flex justify-center items-center">
        <Link href="/" className="font-display-lg text-display-lg text-primary italic hover:text-secondary transition-colors">
          Lady Gasy
        </Link>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-lg py-xl">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-xl text-center">
          Validation de Commande
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-xl max-w-md mx-auto bg-surface-container rounded-xl border border-outline-variant p-md">
            <span className="material-symbols-outlined text-4xl text-primary mb-sm">shopping_bag</span>
            <p className="font-body-lg text-on-surface mb-md">Votre panier est vide.</p>
            <Link href="/catalogue" className="bg-primary text-on-primary font-label-md px-lg py-sm rounded hover:bg-surface-tint transition-all">
              Retourner au catalogue
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Main Form Fields */}
            <div className="lg:col-span-7 space-y-xl">
              {/* Section 1: Identification */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm relative overflow-hidden group">
                <h2 className="font-headline-md text-headline-md text-primary mb-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">person</span>
                  1. Identification
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">
                      Adresse Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-surface border rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface ${
                        errors.email ? "border-error focus:ring-error" : "border-outline-variant"
                      }`}
                    />
                    {errors.email && <span className="text-error text-xs mt-1 block">{errors.email}</span>}
                  </div>
                  <div className="flex items-end h-full pb-[8px]">
                    <p className="text-on-surface-variant text-sm">
                      Déjà client ?{" "}
                      <a href="#" className="text-primary underline font-medium hover:text-secondary transition-colors">
                        Connectez-vous
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2: Livraison */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm relative overflow-hidden group">
                <h2 className="font-headline-md text-headline-md text-primary mb-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  2. Livraison
                </h2>
                <div className="space-y-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="prenom">
                        Prénom *
                      </label>
                      <input
                        id="prenom"
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className={`w-full bg-surface border rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface ${
                          errors.prenom ? "border-error focus:ring-error" : "border-outline-variant"
                        }`}
                      />
                      {errors.prenom && <span className="text-error text-xs mt-1 block">{errors.prenom}</span>}
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="nom">
                        Nom *
                      </label>
                      <input
                        id="nom"
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className={`w-full bg-surface border rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface ${
                          errors.nom ? "border-error focus:ring-error" : "border-outline-variant"
                        }`}
                      />
                      {errors.nom && <span className="text-error text-xs mt-1 block">{errors.nom}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="telephone">
                      Téléphone *
                    </label>
                    <input
                      id="telephone"
                      type="tel"
                      placeholder="+261 34 00 000 00"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className={`w-full bg-surface border rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface ${
                        errors.telephone ? "border-error focus:ring-error" : "border-outline-variant"
                      }`}
                    />
                    {errors.telephone && <span className="text-error text-xs mt-1 block">{errors.telephone}</span>}
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="zone">
                      Zone de Livraison *
                    </label>
                    <select
                      id="zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className={`w-full bg-surface border rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface ${
                        errors.zone ? "border-error focus:ring-error" : "border-outline-variant"
                      }`}
                    >
                      <option value="">Sélectionnez votre zone</option>
                      <option value="antananarivo_centre">Antananarivo - Centre Ville (5 000 Ar)</option>
                      <option value="antananarivo_peripherie">Antananarivo - Périphérie (10 000 Ar)</option>
                      <option value="province">Province (Sur devis - 20 000 Ar)</option>
                    </select>
                    {errors.zone && <span className="text-error text-xs mt-1 block">{errors.zone}</span>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="ville">
                        Ville *
                      </label>
                      <input
                        id="ville"
                        type="text"
                        value={ville}
                        onChange={(e) => setVille(e.target.value)}
                        className={`w-full bg-surface border rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface ${
                          errors.ville ? "border-error focus:ring-error" : "border-outline-variant"
                        }`}
                      />
                      {errors.ville && <span className="text-error text-xs mt-1 block">{errors.ville}</span>}
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="cp">
                        Code Postal
                      </label>
                      <input
                        id="cp"
                        type="text"
                        value={cp}
                        onChange={(e) => setCp(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="adresse">
                      Adresse Complète *
                    </label>
                    <textarea
                      id="adresse"
                      rows={3}
                      placeholder="Numéro, rue, quartier..."
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      className={`w-full bg-surface border rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface resize-none ${
                        errors.adresse ? "border-error focus:ring-error" : "border-outline-variant"
                      }`}
                    />
                    {errors.adresse && <span className="text-error text-xs mt-1 block">{errors.adresse}</span>}
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="repere">
                      Repère Exact (Facultatif)
                    </label>
                    <input
                      id="repere"
                      type="text"
                      placeholder="Près de..."
                      value={repere}
                      onChange={(e) => setRepere(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Paiement */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm relative overflow-hidden group">
                <h2 className="font-headline-md text-headline-md text-primary mb-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  3. Paiement
                </h2>
                <div className="bg-surface-container p-md rounded-md border border-outline-variant flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container">money</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">Paiement à la livraison</p>
                    <p className="font-caption text-caption text-on-surface-variant mt-xs">
                      Vous paierez en espèces lors de la réception de votre commande.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Order Review */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm sticky top-[120px]">
                <h3 className="font-headline-md text-headline-md text-primary mb-lg border-b border-outline-variant pb-sm">
                  Résumé de la commande
                </h3>

                {/* Items list */}
                <div className="space-y-md mb-lg max-h-[300px] overflow-y-auto pr-xs">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-md border-b border-surface-variant/30 pb-xs">
                      <div className="w-20 h-20 bg-surface-variant rounded-sm flex-shrink-0 overflow-hidden flex items-center justify-center p-xs">
                        <img className="w-full h-full object-contain" src={item.product.image} alt={item.product.name} />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-label-md text-label-md text-on-surface line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            {item.product.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-caption text-caption text-on-surface-variant">
                            Qté: {item.quantity}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface">
                            {(item.product.priceAr * item.quantity).toLocaleString()} Ar
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-outline-variant pt-md space-y-sm mb-lg">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Sous-total</span>
                    <span>{subtotalAr.toLocaleString()} Ar</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Livraison ({zone ? "Calculé" : "Estimation"})</span>
                    <span>{zone ? `${shippingFee.toLocaleString()} Ar` : "Sélectionnez votre zone"}</span>
                  </div>
                </div>

                <div className="border-t border-primary pt-md mb-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-headline-md text-headline-md text-primary font-bold">Total</span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">
                      {totalAr.toLocaleString()} Ar
                    </span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant text-right mt-xs">TVA incluse</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary py-md px-lg rounded-md font-label-md text-label-md hover:bg-surface-tint transition-all duration-300 flex items-center justify-center gap-sm shadow-sm hover:shadow-md cursor-pointer"
                >
                  Valider la commande (Paiement à la livraison)
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <p className="font-caption text-caption text-on-surface-variant text-center mt-md flex items-center justify-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Vos données personnelles sont sécurisées.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Simplified footer */}
      <footer className="w-full mt-xl bg-tertiary-fixed border-t border-outline-variant py-xl">
        <div className="max-w-[1280px] mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="font-headline-md text-headline-md text-primary block">Lady Gasy</span>
          <p className="font-caption text-caption text-on-tertiary-fixed-variant text-center md:text-left">
            © {new Date().getFullYear()} Lady Gasy. Tous droits réservés. Expertise botanique pour cheveux naturels.
          </p>
          <div className="flex gap-md flex-wrap justify-center">
            <a className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors text-sm" href="#">
              Mentions Légales
            </a>
            <a className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors text-sm" href="#">
              CGV
            </a>
            <a className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors text-sm" href="#">
              Politique de Confidentialité
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
