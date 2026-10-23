"use client";

import React, { useState, useMemo, use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { ADVICE_CATEGORIES, ADVICE_ARTICLES } from "@/data/adviceData";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AdviceCategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const category = ADVICE_CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    const hasArticles = ADVICE_ARTICLES.some((a) => a.categorySlug === slug);
    if (!hasArticles) {
      notFound();
    }
  }

  const categoryName = category?.name || slug;
  const categoryBanner = category?.bannerSubtitle || "Découvrez nos guides, astuces et rituels botaniques.";

  const categoryArticles = useMemo(() => {
    let list = ADVICE_ARTICLES.filter((a) => a.categorySlug === slug);
    if (list.length === 0) {
      list = ADVICE_ARTICLES;
    }

    if (sortOption === "recent") {
      return [...list].sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortOption === "alpha") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [slug, sortOption]);

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
          <Link href="/diy" className="hover:text-[#33450d] transition-colors">
            Conseils & recettes
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#33450d] font-semibold">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <ScrollReveal direction="down">
          <div className="mb-10 max-w-4xl">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#33450d] uppercase tracking-tight mb-4">
              {categoryName}
            </h1>
            <p className="text-sm md:text-base text-[#6c727f] leading-relaxed max-w-3xl">
              {categoryBanner}
            </p>
          </div>
        </ScrollReveal>

        {/* Filter and Count Bar */}
        <div className="flex items-center justify-between border-b border-[#e5dfd8] pb-4 mb-8 text-sm">
          <span className="font-medium text-[#3e3b3e]">
            {categoryArticles.length} conseil{categoryArticles.length > 1 ? "s" : ""}
          </span>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e5dfd8] bg-white text-xs font-semibold text-[#3e3b3e] hover:border-[#33450d] transition-all cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-[#33450d]" />
              <span>
                {sortOption === "relevance"
                  ? "Pertinence"
                  : sortOption === "recent"
                  ? "Plus récents"
                  : "Ordre alphabétique"}
              </span>
              <ChevronDown size={14} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#ece7e1] py-1 z-30 animate-in fade-in">
                <button
                  onClick={() => {
                    setSortOption("relevance");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                    sortOption === "relevance"
                      ? "bg-[#f8f4ef] font-bold text-[#33450d]"
                      : "text-[#3e3b3e] hover:bg-[#faf7f2]"
                  }`}
                >
                  Pertinence
                </button>
                <button
                  onClick={() => {
                    setSortOption("recent");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                    sortOption === "recent"
                      ? "bg-[#f8f4ef] font-bold text-[#33450d]"
                      : "text-[#3e3b3e] hover:bg-[#faf7f2]"
                  }`}
                >
                  Plus récents
                </button>
                <button
                  onClick={() => {
                    setSortOption("alpha");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                    sortOption === "alpha"
                      ? "bg-[#f8f4ef] font-bold text-[#33450d]"
                      : "text-[#3e3b3e] hover:bg-[#faf7f2]"
                  }`}
                >
                  Ordre alphabétique
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {categoryArticles.map((article, idx) => (
            <ScrollReveal key={article.id} direction="up" delay={(idx % 3) * 100}>
              <Link
                href={`/diy/article/${article.slug}`}
                className="group flex flex-col h-full bg-white rounded-2xl border border-[#ece7e1] overflow-hidden hover:shadow-[0_12px_32px_rgba(51,69,13,0.08)] hover:border-[#33450d]/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f4efe8]">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#33450d] shadow-xs">
                    {article.categoryName}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-[#6c727f] mb-2.5">
                    <Clock size={13} />
                    <span>{article.readTime}</span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-[#3e3b3e] group-hover:text-[#33450d] transition-colors leading-snug mb-2">
                    {article.title}
                  </h2>

                  <p className="text-xs text-[#6c727f] line-clamp-2 leading-relaxed mb-4 flex-grow">
                    {article.subtitle}
                  </p>

                  <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#8e4d33] group-hover:text-[#33450d] transition-colors">
                    <span>Lire le guide complet</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Promotion Banner on Products */}
        <div className="bg-[#f8f4ef] rounded-3xl p-8 sm:p-12 border border-[#ded5c8] mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fff] px-3 py-1 rounded-full mb-3 shadow-2xs">
              <Sparkles size={14} />
              Boutique Botanique
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#33450d] mb-2">
              Envie de mettre en pratique ces rituels ?
            </h3>
            <p className="text-sm text-[#6c727f] leading-relaxed">
              Explorez nos huiles végétales pures pressées à froid, nos macérâts et nos huiles essentielles distillées à Madagascar pour composer vos soins chez vous.
            </p>
          </div>
          <Link
            href="/catalogue"
            className="bg-[#33450d] hover:bg-[#283709] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm flex-shrink-0"
          >
            Découvrir tous nos produits
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
