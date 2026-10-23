"use client";

import React, { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  Quote,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Share2,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { ADVICE_ARTICLES, ADVICE_CATEGORIES } from "@/data/adviceData";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AdviceArticlePage({ params }: PageProps) {
  const { slug } = use(params);

  const article = ADVICE_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  // Related articles
  const relatedArticles = ADVICE_ARTICLES.filter(
    (a) => article.relatedArticleSlugs.includes(a.slug) || (a.categorySlug === article.categorySlug && a.slug !== article.slug)
  ).slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[130px]">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-[#6c727f] mb-8 flex-wrap">
          <Link href="/" className="hover:text-[#33450d] transition-colors">
            Accueil
          </Link>
          <ChevronRight size={13} />
          <Link href="/diy" className="hover:text-[#33450d] transition-colors">
            Conseils & recettes
          </Link>
          <ChevronRight size={13} />
          <Link href={`/diy/categorie/${article.categorySlug}`} className="hover:text-[#33450d] transition-colors">
            {article.categoryName}
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#33450d] font-semibold line-clamp-1">{article.title}</span>
        </nav>

        {/* Hero Article Section (Split layout as per mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-[#f0e8dc] text-[#33450d] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              {article.categoryName}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#3e3b3e] leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-base md:text-lg text-[#6c727f] leading-relaxed mb-6 font-light">
              {article.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6c727f] pt-4 border-t border-[#ece7e1]">
              <span className="flex items-center gap-1.5 font-medium text-[#3e3b3e]">
                <User size={14} className="text-[#33450d]" />
                {article.author.name}
              </span>
              <span className="text-[#d2d5da]">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Publié le {article.publishedDate}
              </span>
              <span className="text-[#d2d5da]">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-[#8e4d33]">
                <Clock size={14} />
                {article.readTime}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#faf7f2] border border-[#e5dfd8] shadow-sm">
              <img
                src={article.heroImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Article Intro / Chapeau */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-base sm:text-lg text-[#3e3b3e] leading-relaxed border-l-4 border-[#33450d] pl-6 py-2 bg-[#faf8f5] rounded-r-2xl italic font-normal">
            {article.intro}
          </div>
        </div>

        {/* Key Takeaways Box (In brief / En bref) */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="max-w-3xl mx-auto mb-14 bg-[#f8f4ef] rounded-2xl p-6 sm:p-8 border border-[#ded5c8]">
            <h3 className="font-serif text-lg font-bold text-[#33450d] mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[#8e4d33]" />
              L'essentiel à retenir :
            </h3>
            <ul className="space-y-3">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#3e3b3e] leading-relaxed">
                  <CheckCircle2 size={18} className="text-[#33450d] flex-shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content Sections with Side-sticky Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto mb-20">
          {/* Main Editorial Text */}
          <div className="lg:col-span-8 space-y-10">
            {article.sections.map((section, sIdx) => (
              <section key={sIdx} className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#33450d] leading-snug">
                  {section.title}
                </h2>
                {section.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm sm:text-base text-[#4d5562] leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.tips && section.tips.length > 0 && (
                  <div className="bg-[#f0f4e8] rounded-xl p-4 border border-[#d6e3c1] my-4">
                    <div className="text-xs font-bold text-[#33450d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      Conseil pratique de notre équipe :
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#33450d]">
                      {section.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}

            {/* Optional DIY Recipe Card in article */}
            {article.diyRecipe && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#33450d]/20 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fdf2ec] px-3 py-1 rounded-full mb-3 inline-block">
                  Recette Express
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#33450d] mb-2">
                  {article.diyRecipe.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-[#6c727f] mb-6">
                  <span>⏱️ {article.diyRecipe.duration}</span>
                  <span>✨ Niveau : {article.diyRecipe.difficulty}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ece7e1]">
                    <h4 className="text-xs font-bold text-[#33450d] mb-2">Ingrédients :</h4>
                    <ul className="text-xs space-y-1.5 text-[#3e3b3e]">
                      {article.diyRecipe.ingredients.map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#33450d] mb-2">Préparation :</h4>
                    <ol className="text-xs space-y-2 text-[#4d5562]">
                      {article.diyRecipe.instructions.map((step, s) => (
                        <li key={s} className="flex gap-2">
                          <span className="font-bold text-[#33450d]">{s + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Expert Quote Card */}
            {article.expertQuote && (
              <div className="bg-[#faf7f2] rounded-2xl p-6 sm:p-8 border-l-4 border-[#8e4d33] flex gap-4">
                <Quote size={36} className="text-[#8e4d33]/40 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-[#3e3b3e] italic leading-relaxed mb-3">
                    &quot;{article.expertQuote.text}&quot;
                  </p>
                  <p className="text-xs font-bold text-[#33450d]">
                    {article.expertQuote.author}
                  </p>
                  <p className="text-[11px] text-[#6c727f]">
                    {article.expertQuote.role}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar: Promoted Products directly linked to this article */}
          <aside className="lg:col-span-4">
            <div className="sticky top-[130px] space-y-6">
              <div className="bg-white rounded-2xl border border-[#ece7e1] p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#33450d] mb-4 pb-2 border-b border-[#f0e8dc]">
                  <ShoppingBag size={16} />
                  Sélection recommandation
                </div>

                <div className="space-y-4">
                  {article.promotedProducts.map((prod, pIdx) => (
                    <div
                      key={pIdx}
                      className="group bg-[#faf8f5] hover:bg-[#f6f2ec] rounded-xl p-3.5 border border-[#eee6dc] transition-all flex flex-col gap-2"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-[#e5dfd8]">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {prod.badge && (
                            <span className="text-[10px] font-bold text-[#8e4d33] uppercase">
                              {prod.badge}
                            </span>
                          )}
                          <h4 className="font-semibold text-xs text-[#33450d] line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-[#6c727f] line-clamp-1">
                            {prod.tagline}
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#4d5562] leading-tight">
                        {prod.recommendedUse}
                      </p>

                      <Link
                        href={`/catalogue?cat=${prod.catalogCategory}`}
                        className="mt-1 w-full bg-[#33450d] hover:bg-[#283709] text-white text-center py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Voir au catalogue
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[#f0e8dc] text-center">
                  <Link
                    href="/catalogue"
                    className="text-xs font-bold text-[#8e4d33] hover:text-[#33450d] transition-colors inline-flex items-center gap-1"
                  >
                    Voir toute la boutique Lady Gasy
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Associated Tips / Related Articles Carousel / Grid */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-[#ece7e1] pt-12 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#33450d]">
                  Conseils associés
                </h3>
                <p className="text-xs sm:text-sm text-[#6c727f]">
                  Poursuivez votre lecture avec nos autres guides botaniques recommandés.
                </p>
              </div>
              <Link
                href="/diy"
                className="text-xs font-bold text-[#8e4d33] hover:text-[#33450d] flex items-center gap-1 transition-colors"
              >
                Tous les conseils
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/diy/article/${rel.slug}`}
                  className="group bg-white rounded-2xl border border-[#ece7e1] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#faf8f5]">
                    <img
                      src={rel.heroImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[11px] font-bold text-[#8e4d33] uppercase mb-1">
                      {rel.categoryName}
                    </span>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#3e3b3e] group-hover:text-[#33450d] transition-colors mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-xs text-[#6c727f] mt-auto flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {rel.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
