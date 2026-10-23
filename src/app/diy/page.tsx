"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Heart,
  ArrowRight,
  ChevronRight,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { ADVICE_CATEGORIES, ADVICE_ARTICLES } from "@/data/adviceData";

export default function ConseilsEtRecettesHubPage() {
  const [activeTab, setActiveTab] = useState<"TOUS" | "CONSEILS" | "RECETTES">("TOUS");

  // Associated tips from mockups
  const featuredArticles = ADVICE_ARTICLES.slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[130px]">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-[#6c727f] mb-6">
          <Link href="/" className="hover:text-[#33450d] transition-colors">
            Accueil
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#33450d] font-semibold">Conseils & recettes</span>
        </nav>

        {/* Hero Section styled like Aroma-Zone Advice Hero */}
        <div className="relative rounded-3xl bg-[#f8f4ef] border border-[#ece7e1] overflow-hidden p-6 sm:p-10 lg:p-12 mb-16 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 bg-[#f0e8dc] text-[#33450d] px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
                <Sparkles size={14} />
                L'Expertise Botanique & Beauté Naturelle
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#33450d] tracking-tight mb-4 leading-tight">
                Conseils & Recettes
              </h1>
              <p className="text-base sm:text-lg text-[#6c727f] font-light">
                Découvrez nos conseils d&apos;experts, guides d&apos;aromathérapie et recettes saines pour prendre soin de votre corps, vos cheveux et votre esprit au quotidien.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section ("Nos Catégories") - Aroma-Zone Grid */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#e5dfd8]">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3e3b3e]">
                Nos univers conseils
              </h2>
              <p className="text-xs sm:text-sm text-[#6c727f] mt-1">
                Explorez par domaine d&apos;application pour trouver des réponses précises à vos besoins.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {ADVICE_CATEGORIES.map((cat, idx) => (
              <ScrollReveal key={cat.id} direction="up" delay={(idx % 6) * 50}>
                <Link
                  href={`/diy/categorie/${cat.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-[#ece7e1] hover:border-[#33450d]/40 hover:shadow-md transition-all duration-300 h-full"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#faf7f2] mb-3 flex-shrink-0">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#3e3b3e] group-hover:text-[#33450d] transition-colors leading-snug mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#6c727f] line-clamp-2 leading-tight">
                    {cat.description}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Featured Guides & Articles ("Conseils associés / Les incontournables") */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#e5dfd8]">
            <div className="flex items-center gap-2">
              <Flame size={22} className="text-[#8e4d33]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3e3b3e]">
                Articles & Guides à la une
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.map((article, idx) => (
              <ScrollReveal key={article.id} direction="up" delay={(idx % 4) * 80}>
                <Link
                  href={`/diy/article/${article.slug}`}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-[#ece7e1] overflow-hidden hover:shadow-lg hover:border-[#33450d]/30 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#faf8f5]">
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#33450d] shadow-2xs">
                      {article.categoryName}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6c727f] mb-1.5">
                      <Clock size={12} />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#3e3b3e] group-hover:text-[#33450d] transition-colors leading-snug mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#6c727f] line-clamp-2 leading-relaxed mb-4 flex-grow">
                      {article.subtitle}
                    </p>

                    <div className="pt-2.5 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#8e4d33] group-hover:text-[#33450d] transition-colors">
                      <span>Lire le conseil</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Promotion Banner Linking to Catalogue */}
        <section className="bg-gradient-to-r from-[#f8f4ef] to-[#f4eee6] rounded-3xl p-8 sm:p-12 border border-[#ded5c8] mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8e4d33] bg-white px-3 py-1 rounded-full mb-3 inline-block shadow-2xs">
                La Boutique Pure & Botanique
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#33450d] mb-3">
                Des ingrédients d&apos;exception pour vos rituels
              </h3>
              <p className="text-sm text-[#4d5562] leading-relaxed">
                Tous les produits cités dans nos guides (huiles végétales pures de Madagascar, huiles essentielles BIO, poudres et beurres bruts) sont disponibles et livrés directement chez vous.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="bg-[#33450d] hover:bg-[#283709] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-colors shadow-sm flex-shrink-0"
            >
              Accéder au Catalogue
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
