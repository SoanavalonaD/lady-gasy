"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import {
  Sparkles,
  Scissors,
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Heart,
  Star,
  Quote,
  ShieldCheck,
  Leaf,
  Layers,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import {
  SALON_CATEGORIES,
  SALON_SERVICES,
  SALON_SUBCATEGORIES,
  SALON_TESTIMONIALS,
  SalonCategory,
  SalonCategoryId,
  SalonServiceItem,
} from "@/data/salonServices";

export default function SalonServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | SalonCategoryId>("ALL");

  const servicesByCategory = (id: SalonCategoryId) =>
    SALON_SERVICES.filter((item) => item.category === id);

  const activeCategory = SALON_CATEGORIES.find((c) => c.id === selectedCategory);

  /** Grille des prestations d'une catégorie, regroupée par technique si demandé */
  const renderCategoryServices = (category: SalonCategory) => {
    const items = servicesByCategory(category.id);

    if (!category.groupBySubcategory) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(renderServiceCard)}
        </div>
      );
    }

    // Regroupement en conservant l'ordre d'apparition des sous-catégories
    const groups = items.reduce<{ key: string; items: SalonServiceItem[] }[]>((acc, item) => {
      const group = acc.find((g) => g.key === item.subcategory);
      if (group) group.items.push(item);
      else acc.push({ key: item.subcategory, items: [item] });
      return acc;
    }, []);

    return (
      <div className="space-y-8">
        {groups.map((group) => {
          const meta = SALON_SUBCATEGORIES[group.key];
          return (
            <div
              key={group.key}
              className="rounded-3xl border border-[#ece7e1] bg-[#faf7f2]/60 p-5 sm:p-6"
            >
              <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                  {meta?.tagline && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fbf3ee] px-2.5 py-0.5 rounded-full">
                      {meta.tagline}
                    </span>
                  )}
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#33450d] mt-2 flex items-center gap-2">
                    <Scissors size={18} className="text-[#8e4d33]" />
                    {meta?.title ?? group.key}
                  </h4>
                  {meta?.description && (
                    <p className="text-xs sm:text-sm text-[#6c727f] mt-1 max-w-2xl">{meta.description}</p>
                  )}
                </div>
                <span className="text-[11px] text-[#8b8f96] shrink-0">
                  {group.items.length} prestation{group.items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map(renderServiceCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderServiceCard = (item: SalonServiceItem, idx: number) => (
    <ScrollReveal key={item.id} direction="up" delay={(idx % 3) * 60}>
      <div className="bg-white rounded-2xl border border-[#ece7e1] p-5 shadow-xs hover:shadow-md hover:border-[#33450d]/40 transition-all duration-300 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            {item.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#33450d] bg-[#e3e9d1] px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-[#3e3b3e] mb-2 leading-snug">
            {item.service}
          </h3>

          {item.description && (
            <p className="text-xs text-[#6c727f] leading-relaxed mb-4">
              {item.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between">
          <div>
            {item.note && (
              <span className="block text-[10px] text-[#8e4d33] font-medium leading-none mb-0.5">
                {item.note}
              </span>
            )}
            <span className="font-serif text-xl font-bold text-[#33450d]">
              {item.price}
            </span>
          </div>

          <a
            href="tel:+261385200025"
            className="bg-[#33450d]/10 hover:bg-[#33450d] text-[#33450d] hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Réserver</span>
            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </ScrollReveal>
  );

  /** Panneau affiché pour une catégorie sans tarifs (bientôt disponible ou sur demande) */
  const renderEmptyCategory = (category: SalonCategory) => (
    <div className="rounded-2xl border border-dashed border-[#d9cfc2] bg-[#faf7f2] p-8 sm:p-10 text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-[#fde9d6] text-[#8e4d33] flex items-center justify-center mb-4">
        {category.comingSoon ? <Clock size={22} /> : <Sparkles size={22} />}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fbf3ee] px-2.5 py-0.5 rounded-full mb-3">
        {category.comingSoon ? "Bientôt disponible" : "Tarifs sur demande"}
      </span>
      <h3 className="font-serif text-xl font-bold text-[#33450d] mb-2">{category.label}</h3>
      <p className="text-xs sm:text-sm text-[#6c727f] mb-5">
        {category.description}{" "}
        {category.comingSoon
          ? "Cette prestation arrive très bientôt au salon Lady Gasy."
          : "Contactez le salon pour connaître nos modèles et tarifs."}
      </p>
      <a
        href="tel:+261385200025"
        className="bg-[#33450d] hover:bg-[#283709] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Phone size={14} />
        {category.comingSoon ? "Être informée de l'ouverture" : "Demander un devis"}
      </a>
    </div>
  );

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[130px]">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-[#6c727f] mb-6">
          <Link href="/" className="hover:text-[#33450d] transition-colors">
            Accueil
          </Link>
          <span className="text-[#d2d5da]">/</span>
          <span className="text-[#33450d] font-semibold">Le Salon Lady Gasy</span>
        </nav>

        {/* Hero Section matching the services.html mockup */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#faf7f2] via-[#f7f2ea] to-[#eee6da] border border-[#e5dfd8] overflow-hidden p-6 sm:p-10 lg:p-14 mb-16 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-[#33450d] text-white px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
                <Scissors size={14} />
                Lady Gasy Salon
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#33450d] tracking-tight mb-4 leading-tight">
                Là où le soin expert devient un moment pour soi.
              </h1>

              <div className="space-y-3 text-sm sm:text-base text-[#4d5562] mb-8">
                <p>
                  <strong>Notre Mission :</strong> Offrir aux femmes un espace chaleureux et intime où le soin capillaire et l&apos;onglerie deviennent un véritable rituel de régénération et de lâcher-prise.
                </p>
                <p className="text-xs sm:text-sm text-[#6c727f]">
                  Nos coiffeuses et techniciennes expertes nourrissent et hydratent la fibre capillaire grâce à des techniques de pointe (Shaping Cut, Dégradé Cascade, Clarification douce) et subliment vos mains avec minutie.
                </p>
              </div>

              {/* Call to action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:+261385200025"
                  className="bg-[#33450d] hover:bg-[#283709] text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Phone size={16} />
                  Réserver au salon : +261 38 52 000 25
                </a>
                <a
                  href="#tarifs"
                  className="bg-white hover:bg-[#faf8f5] text-[#33450d] border border-[#33450d]/30 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  Consulter la carte des tarifs
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Visual showcase with banner image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md border-2 border-white">
                <img
                  src="/banees1.jpg"
                  alt="Salon de coiffure et onglerie Lady Gasy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] uppercase tracking-wider text-[#faecbb] font-bold mb-1">
                    Salon Lady Gasy
                  </span>
                  <p className="text-sm font-serif font-semibold">
                    L&apos;expertise soin au service de boucles et d&apos;ongles sublimes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitments & Values (Clean, Naturel, Cruelty Free) */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fdf2ec] px-3.5 py-1 rounded-full mb-2 inline-block">
              Notre charte d&apos;excellence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3e3b3e]">
              Les produits que nous utilisons
            </h2>
            <p className="text-xs sm:text-sm text-[#6c727f] mt-2">
              Nous sélectionnons uniquement des formules saines, pures et efficaces, adaptées aux cheveux ondulés, bouclés, frisés et crépus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#ece7e1] text-center shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#e3e9d1] text-[#33450d] flex items-center justify-center mb-4">
                <Leaf size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#33450d] mb-2 uppercase tracking-wide">
                100% Organique
              </h3>
              <p className="text-xs text-[#6c727f] leading-relaxed">
                Ingrédients sourcés à partir des plantes et richesses naturelles de Madagascar : ricin, fenugrec, coco et huiles essentielles nobles.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#ece7e1] text-center shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#fde9d6] text-[#8e4d33] flex items-center justify-center mb-4">
                <Heart size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#33450d] mb-2 uppercase tracking-wide">
                Cruelty Free
              </h3>
              <p className="text-xs text-[#6c727f] leading-relaxed">
                Soins bienveillants formulés dans le respect du vivant, jamais testés sur les animaux et conçus avec douceur.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#ece7e1] text-center shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#d6ebf1] text-[#33450d] flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#33450d] mb-2 uppercase tracking-wide">
                Sans Substances Toxiques
              </h3>
              <p className="text-xs text-[#6c727f] leading-relaxed">
                0% sulfates décapants, sans silicones étouffants, sans parabènes ni perturbateurs endocriniens pour préserver votre santé.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing & Service Catalog Section */}
        <section id="tarifs" className="mb-20 scroll-mt-36">
          <div className="mb-8 pb-4 border-b border-[#e5dfd8]">
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fbf3ee] px-3 py-1 rounded-full mb-2 inline-block">
                Carte des prestations
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#33450d]">
                Tarifs de nos Services
              </h2>
              <p className="text-xs sm:text-sm text-[#6c727f] mt-1">
                Tous les tarifs appliqués au salon en Ariary (Ar), transparents et sans surprise.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Catégories de prestations">
              <button
                id="salon-tab-all"
                role="tab"
                aria-selected={selectedCategory === "ALL"}
                onClick={() => setSelectedCategory("ALL")}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === "ALL"
                    ? "bg-[#33450d] text-white border-[#33450d] shadow-2xs"
                    : "bg-[#f4efe8] text-[#4d5562] border-[#ded5c8] hover:text-[#33450d] hover:border-[#33450d]/40"
                }`}
              >
                Tout
              </button>
              {SALON_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`salon-tab-${cat.id.toLowerCase()}`}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#33450d] text-white border-[#33450d] shadow-2xs"
                        : cat.comingSoon
                          ? "bg-white text-[#8b8f96] border-dashed border-[#ded5c8] hover:text-[#33450d] hover:border-[#33450d]/40"
                          : "bg-[#f4efe8] text-[#4d5562] border-[#ded5c8] hover:text-[#33450d] hover:border-[#33450d]/40"
                    }`}
                  >
                    {cat.label}
                    {cat.comingSoon && (
                      <span
                        className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-[#fbf3ee] text-[#8e4d33]"
                        }`}
                      >
                        Bientôt
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCategory === "ALL" ? (
            <div className="space-y-14">
              {/* Catégories disponibles, groupées */}
              {SALON_CATEGORIES.filter((cat) => !cat.comingSoon).map((cat) => {
                const items = servicesByCategory(cat.id);
                return (
                  <div key={cat.id}>
                    <div className="mb-5">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#33450d]">{cat.label}</h3>
                      <p className="text-xs sm:text-sm text-[#6c727f] mt-1">{cat.description}</p>
                    </div>
                    {items.length > 0 ? renderCategoryServices(cat) : renderEmptyCategory(cat)}
                  </div>
                );
              })}

              {/* Prochainement au salon */}
              <div>
                <div className="mb-5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#33450d]">Bientôt au salon</h3>
                  <p className="text-xs sm:text-sm text-[#6c727f] mt-1">
                    De nouvelles prestations bien-être arrivent prochainement.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SALON_CATEGORIES.filter((cat) => cat.comingSoon).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className="text-left rounded-2xl border border-dashed border-[#d9cfc2] bg-[#faf7f2] p-5 hover:border-[#33450d]/40 hover:bg-white transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fbf3ee] px-2.5 py-0.5 rounded-full">
                        Bientôt disponible 
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#3e3b3e] mt-3 mb-1">{cat.label}</h4>
                      <p className="text-xs text-[#6c727f] leading-relaxed">{cat.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : activeCategory && servicesByCategory(activeCategory.id).length > 0 && !activeCategory.comingSoon ? (
            renderCategoryServices(activeCategory)
          ) : (
            activeCategory && renderEmptyCategory(activeCategory)
          )}
        </section>
        

        {/* Contact & Reservation Box */}
        <section className="bg-gradient-to-r from-[#33450d] to-[#253308] text-white rounded-3xl p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#faecbb] bg-white/10 px-3.5 py-1 rounded-full inline-block">
                Prendre rendez-vous
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                Envie de sublimer vos cheveux ou vos ongles ?
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl font-light">
                Notre équipe vous accueille avec écoute et expertise au salon. Contactez-nous par téléphone ou rendez-nous visite directement.
              </p>

              <div className="flex flex-wrap gap-6 pt-2 text-xs sm:text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#faecbb]" />
                  <span>Info & Réservation : <strong>+261 38 52 000 25</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#faecbb]" />
                  <span>2ème étage Immeuble Ikano, Ambodivona</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href="tel:+261385200025"
                className="w-full bg-white hover:bg-[#faf8f5] text-[#33450d] font-bold text-center py-3.5 px-6 rounded-full text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
              >
                Appeler pour réserver
              </a>
              <Link
                href="/contact"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-center py-3.5 px-6 rounded-full text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Localiser sur la carte
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
