"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Sparkles, Clock, CheckCircle2, BookOpen, Lightbulb, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Recipe {
  id: string;
  title: string;
  category: "Cheveux" | "Visage" | "Corps";
  duration: string;
  difficulty: "Facile" | "Moyen";
  description: string;
  ingredients: string[];
  instructions: string[];
  benefits: string;
  tags: string[];
}

const RECIPES: Recipe[] = [
  {
    id: "masque-pousse-fenugrec",
    title: "Bain d'huile stimulateur de pousse au Fenugrec & Romarin",
    category: "Cheveux",
    duration: "10 min préparation · 45 min pose",
    difficulty: "Facile",
    description:
      "Un bain d'huile concentré en actifs fortifiants pour activer la microcirculation du cuir chevelu, stimuler la pousse et freiner la chute.",
    ingredients: [
      "2 cuillères à soupe d'Huile de Fenugrec",
      "1 cuillère à soupe d'Huile de Ricin fortifiante",
      "3 gouttes d'Huile essentielle de Romarin à cinéole",
      "1 cuillère à soupe d'Huile d'Avocat (pour adoucir et nourrir)",
    ],
    instructions: [
      "Dans un bol propre, mélangez l'huile de fenugrec et l'huile d'avocat.",
      "Ajoutez l'huile de ricin (plus épaisse) et chauffez très légèrement le mélange au bain-marie tiède.",
      "Incorporez les 3 gouttes d'huile essentielle de romarin et mélangez.",
      "Appliquez raie par raie sur cuir chevelu sec ou légèrement humidifié en effectuant des mouvements circulaires pendant 5 minutes.",
      "Enveloppez vos cheveux d'un bonnet en satin ou d'une serviette tiède, laissez poser 45 minutes puis lavez avec votre shampoing doux habituel.",
    ],
    benefits: "Renforce les racines, active la pousse et apporte densité aux cheveux fins ou cassants.",
    tags: ["Pousse", "Anti-chute", "Cuir chevelu"],
  },
  {
    id: "gel-lin-boucles",
    title: "Gel de graines de lin maison pour définition des boucles",
    category: "Cheveux",
    duration: "15 min",
    difficulty: "Facile",
    description:
      "L'incontournable soin 100% naturel pour des boucles parfaitement rebondies, sans effet carton ni résidus.",
    ingredients: [
      "30 g de Graines de lin brunes ou dorées",
      "250 ml d'eau minérale ou filtrée",
      "1 cuillère à café d'Huile de Jojoba ou d'Argan",
      "3 gouttes de Vitamine E (conservateur naturel)",
    ],
    instructions: [
      "Dans une casserole, versez l'eau et les graines de lin.",
      "Portez à ébullition à feu moyen en remuant régulièrement avec une spatule en bois.",
      "Dès que le mélange forme une écume blanche et prend une texture de blanc d'œuf (environ 7 à 10 min), retirez du feu.",
      "Filtrez immédiatement à chaud à l'aide d'un bas nylon ou d'une passoire fine dans un bocal propre.",
      "Ajoutez l'huile de jojoba et les gouttes de vitamine E, puis mélangez délicatement.",
      "Laissez refroidir. Conservez au réfrigérateur pendant 2 à 3 semaines.",
    ],
    benefits: "Hydrate, gaine la fibre capillaire et maintient la forme des boucles tout au long de la journée.",
    tags: ["Boucles", "Hydratation", "Sans rinçage"],
  },
  {
    id: "masque-purifiant-argile-tea-tree",
    title: "Masque purifiant & anti-imperfections à l'Argile et Tea Tree",
    category: "Visage",
    duration: "5 min préparation · 10 min pose",
    difficulty: "Facile",
    description:
      "Un soin détoxifiant minute pour désincruster les pores, apaiser les rougeurs et réguler l'excès de sébum.",
    ingredients: [
      "2 cuillères à café d'Argile naturelle",
      "1 cuillère à soupe d'Hydrolat de géranium ou d'eau florale",
      "1/2 cuillère à café d'Huile de Nigelle ou Jojoba",
      "1 goutte d'Huile essentielle de Tea tree (arbre à thé)",
    ],
    instructions: [
      "Dans un bol en céramique ou en bois (évitez le métal qui décharge l'argile), déposez l'argile.",
      "Ajoutez l'hydrolat petit à petit en mélangeant avec une cuillère en bois jusqu'à obtenir une pâte onctueuse.",
      "Incorporez l'huile de nigelle et la goutte d'huile essentielle de tea tree.",
      "Appliquez sur l'ensemble du visage propre en évitant le contour des yeux.",
      "Laissez poser 10 minutes maximum : veillez à ce que l'argile ne sèche pas complètement sur la peau (vaporisez un peu d'hydrolat si besoin).",
      "Rincez abondamment à l'eau tiède puis appliquez quelques gouttes de votre sérum ou huile de jojoba.",
    ],
    benefits: "Teint net, pores resserrés, boutons apaisés sans assécher la barrière cutanée.",
    tags: ["Acné", "Pores", "Détox"],
  },
  {
    id: "gommage-corps-gourmand",
    title: "Gommage corps nourrissant Café, Sucre & Amande douce",
    category: "Corps",
    duration: "5 min",
    difficulty: "Facile",
    description:
      "Un gommage corporel énergisant qui exfolie en douceur, lisse le grain de peau et laisse un film protecteur soyeux.",
    ingredients: [
      "3 cuillères à soupe de marc de café ou sucre roux",
      "3 cuillères à soupe d'Huile d'Amande douce",
      "1 cuillère à soupe d'Huile de Baobab",
      "2 gouttes d'Huile essentielle d'Orange douce (pour un parfum réconfortant)",
    ],
    instructions: [
      "Mélangez le marc de café et les huiles végétales dans un pot hermétique.",
      "Ajoutez l'huile essentielle d'orange douce et homogénéisez bien.",
      "Sous la douche, massez par mouvements circulaires sur peau humide (jambes, bras, dos, coudes).",
      "Insistez sur les zones sèches puis rincez à l'eau claire sans savonner pour profiter du voile soyeux de l'huile d'amande.",
    ],
    benefits: "Peau satinée, effet peau neuve immédiat et prévention efficace des poils incarnés.",
    tags: ["Exfoliant", "Douceur", "Anti-peaux mortes"],
  },
  {
    id: "chantilly-karite-reparatrice",
    title: "Chantilly de karité fouettée multi-usage ultra-fondante",
    category: "Corps",
    duration: "20 min",
    difficulty: "Moyen",
    description:
      "Une texture nuage divine qui fond instantanément au contact de la peau pour nourrir les peaux de croco et sceller l'hydratation des pointes de cheveux.",
    ingredients: [
      "100 g de Beurre de karité brut non raffiné",
      "2 cuillères à soupe d'Huile d'Avocat ou d'Olive",
      "1 cuillère à soupe d'Huile de Coco pressée à froid",
      "5 gouttes de Vitamine E",
    ],
    instructions: [
      "Émiettez le beurre de karité ramolli à température ambiante dans un saladier.",
      "Fouettez au batteur électrique pendant 5 minutes jusqu'à ce que le beurre devienne crémeux.",
      "Versez doucement les huiles végétales tout en continuant de battre à vitesse moyenne.",
      "Ajoutez la vitamine E et continuez à battre jusqu'à obtenir une texture aérée et mousseuse semblable à de la crème chantilly.",
      "Transvasez dans un pot propre et conservez à l'abri de la chaleur.",
    ],
    benefits: "Réparation intense des peaux très sèches, prévention des vergetures et protection des pointes capillaires.",
    tags: ["Nourrissant", "Vergetures", "Multi-usage"],
  },
];

const DIY_TIPS = [
  {
    title: "Toujours diluer les huiles essentielles",
    text: "Les huiles essentielles sont de purs concentrés botaniques. Ne les appliquez jamais pures sur la peau : diluez toujours 1 à 3 gouttes dans 1 cuillère à soupe d'huile végétale porteuse.",
  },
  {
    title: "Le test du pli du coude",
    text: "Avant d'appliquer une nouvelle recette ou huile essentielle sur votre visage ou cuir chevelu, appliquez 1 goutte au pli du coude et attendez 24 heures pour vérifier l'absence de réaction allergique.",
  },
  {
    title: "Conservez vos créations à l'abri de la lumière",
    text: "Les huiles végétales et macérâts sont sensibles aux UV et à la chaleur. Conservez vos préparations dans des flacons en verre ambré bien fermés et dans un endroit tempéré.",
  },
  {
    title: "Hydrater d'abord, sceller ensuite (Méthode LOC)",
    text: "Pour les cheveux bouclés, frisés ou très secs : appliquez d'abord une phase aqueuse (eau, leave-in au lin, hydrolat), puis scellez avec une huile végétale adaptée (jojoba, avocat ou chantilly).",
  },
];

export default function DiyPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("TOUS");

  const filteredRecipes =
    selectedFilter === "TOUS"
      ? RECIPES
      : RECIPES.filter((r) => r.category.toUpperCase() === selectedFilter);

  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-container-padding md:px-lg py-xl pt-[120px]">
        {/* Hero Section */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-[#f0e8dc] text-[#33450d] px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles size={16} />
              Atelier Botanique & Cosmétique Maison
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#33450d] mb-4">
              Ingrédients & Recettes DIY
            </h1>
            <p className="font-body-md text-[#6c727f] text-base md:text-lg">
              Prenez soin de vous naturellement avec nos recettes faciles, nos astuces de spécialistes et nos rituels faits maison à base d'huiles végétales et d'extraits purs.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Pills Filter */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {["TOUS", "CHEVEUX", "VISAGE", "CORPS"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all cursor-pointer ${
                selectedFilter === cat
                  ? "bg-[#33450d] text-white shadow-sm"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              {cat === "TOUS" ? "Toutes les recettes" : cat}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredRecipes.map((recipe) => (
            <ScrollReveal key={recipe.id} direction="up">
              <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e4d33] bg-[#fbf3ee] px-2.5 py-0.5 rounded-md">
                      {recipe.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#6c727f]">
                      <Clock size={14} />
                      {recipe.duration}
                    </span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-[#33450d] mb-2 leading-snug">
                    {recipe.title}
                  </h2>

                  <p className="text-xs text-[#6c727f] mb-4 leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Ingredients List */}
                  <div className="bg-[#fcfaf7] p-3.5 rounded-xl border border-[#ece4d9] mb-4">
                    <h3 className="text-xs font-bold text-[#33450d] mb-2 flex items-center gap-1.5">
                      <BookOpen size={14} />
                      Ingrédients nécessaires :
                    </h3>
                    <ul className="space-y-1 text-xs text-[#3e3b3e]">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#33450d] font-bold">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-[#33450d] mb-2">
                      Préparation & Application :
                    </h3>
                    <ol className="space-y-2 text-xs text-[#4b515d]">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#33450d]/10 text-[#33450d] font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Benefits Footer */}
                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#33450d] font-medium">
                    <Heart size={14} className="text-[#8e4d33]" />
                    <span>{recipe.benefits}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Tips Section */}
        <ScrollReveal direction="up">
          <div className="bg-[#f7f4ee] rounded-2xl p-6 md:p-10 border border-[#e4dcd1]">
            <div className="flex items-center gap-2 text-[#33450d] font-bold text-lg md:text-xl mb-4">
              <Lightbulb className="text-[#e09145]" size={24} />
              Les Bons Réflexes du DIY Botanique
            </div>
            <p className="text-sm text-[#5f6571] mb-6 max-w-2xl">
              Créer ses soins chez soi est économique, sain et gratifiant. Respectez ces règles d&apos;or pour une utilisation sereine et efficace de vos actifs naturels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DIY_TIPS.map((tip, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-[#ded5c8] shadow-2xs">
                  <h4 className="font-semibold text-sm text-[#33450d] mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0" />
                    {tip.title}
                  </h4>
                  <p className="text-xs text-[#6c727f] leading-relaxed">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA to Catalogue */}
            <div className="mt-8 pt-6 border-t border-[#ded5c8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-base text-[#33450d]">
                  Besoin d'ingrédients bruts pour commencer ?
                </h4>
                <p className="text-xs text-[#6c727f]">
                  Retrouvez nos huiles végétales pures pressées à froid et nos huiles essentielles dans notre catalogue.
                </p>
              </div>
              <Link
                href="/catalogue"
                className="bg-[#33450d] hover:bg-[#283709] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors flex-shrink-0"
              >
                Découvrir nos soins & huiles
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
