export interface AdviceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerSubtitle: string;
  image: string;
}

export interface AdviceProductPromo {
  name: string;
  tagline: string;
  description: string;
  image: string;
  catalogCategory: string;
  recommendedUse: string;
  badge?: string;
}

export interface AdviceArticle {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  title: string;
  subtitle: string;
  intro: string;
  heroImage: string;
  readTime: string;
  publishedDate: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
  };
  keyTakeaways: string[];
  sections: {
    title: string;
    content: string[];
    tips?: string[];
  }[];
  expertQuote?: {
    text: string;
    author: string;
    role: string;
  };
  diyRecipe?: {
    title: string;
    duration: string;
    difficulty: string;
    ingredients: string[];
    instructions: string[];
  };
  promotedProducts: AdviceProductPromo[];
  relatedArticleSlugs: string[];
}

export const ADVICE_CATEGORIES: AdviceCategory[] = [
  {
    id: "aromatherapie",
    slug: "aromatherapie",
    name: "Conseils Aromathérapie",
    description: "Huiles essentielles pures : vertus, posologies et tout ce que vous devez savoir pour les utiliser en toute sécurité.",
    bannerSubtitle: "Découvrez nos conseils d'aromathérapie pour utiliser les huiles essentielles en toute sécurité : immunité, stress, sommeil et bien-être respiratoire.",
    image: "/products/huile-ravintsara.jpeg",
  },
  {
    id: "beaute",
    slug: "beaute",
    name: "Astuces Beauté & Peau",
    description: "Révélez l'éclat naturel de votre teint et sublimez votre peau grâce aux vertus des huiles végétales précieuses.",
    bannerSubtitle: "Nos guides et rituels botaniques pour prendre soin de votre visage au naturel selon votre typologie de peau.",
    image: "/products/huile-jojoba.jpg",
  },
  {
    id: "cheveux",
    slug: "cheveux",
    name: "Soins & Pousse des Cheveux",
    description: "Stimuler la repousse, densifier la fibre et nourrir les boucles sans alourdir.",
    bannerSubtitle: "Rituels capillaires fortifiants, bains d'huiles régénérants et astuces anti-chute adaptées à toutes les textures.",
    image: "/products/huile-cheveux-ninaka.jpeg",
  },
  {
    id: "actifs-naturels",
    slug: "actifs-naturels",
    name: "Actifs Naturels & Poudres",
    description: "Argiles, beurres végétaux, rhassoul et trésors botaniques de Madagascar et d'ailleurs.",
    bannerSubtitle: "Explorez les propriétés exceptionnelles des poudres minérales, beurres bruts et trésors botaniques pour vos rituels bien-être.",
    image: "/products/beure-karite.jpeg",
  },
  {
    id: "bien-etre",
    slug: "bien-etre",
    name: "Bien-être & Remèdes Doux",
    description: "Astuces naturelles pour votre équilibre quotidien, vitalité, relaxation et hygiène saine.",
    bannerSubtitle: "Prendre soin de son corps et de son esprit avec les secrets des plantes médicinales traditionnelles.",
    image: "/products/huile-lavande.jpeg",
  },
  {
    id: "recettes-diy",
    slug: "recettes-diy",
    name: "Recettes & Atelier DIY",
    description: "Formulez vos cosmétiques maison sains, efficaces et économiques pas à pas.",
    bannerSubtitle: "Nos recettes simples et approuvées pour fabriquer vos masques, gommages et sérums naturels sur-mesure.",
    image: "/products/coco-delice.jpeg",
  },
];

export const ADVICE_ARTICLES: AdviceArticle[] = [
  {
    id: "1",
    slug: "apaiser-toux-seche-huiles-essentielles",
    categorySlug: "aromatherapie",
    categoryName: "Conseils Aromathérapie",
    title: "Comment apaiser la toux sèche avec les huiles essentielles ?",
    subtitle: "Les solutions naturelles et efficaces pour calmer l'irritation de la gorge et retrouver une respiration sereine.",
    intro:
      "Soulager les quintes de toux et apaiser les voies respiratoires irritées grâce au secours précieux des huiles essentielles. Antispasmodiques, antivirales et douces pour les muqueuses, découvrez les essences clés à adopter dès les premiers picotements.",
    heroImage: "/products/huile-ravintsara.jpeg",
    readTime: "5 min de lecture",
    publishedDate: "12 Octobre 2026",
    updatedDate: "20 Octobre 2026",
    author: {
      name: "Équipe Botanique Lady Gasy",
      role: "Naturopathes & Spécialistes en aromathérapie",
    },
    keyTakeaways: [
      "L'huile essentielle de Ravintsara de Madagascar est l'alliée maîtresse pour soutenir les défenses et purifier l'arbre respiratoire.",
      "Le Cyprès est réputé pour calmer le réflexe de toux sèche d'irritation.",
      "Ne jamais appliquer une huile essentielle pure sur la gorge ou le thorax : diluez toujours dans une huile végétale douce (amande ou avocat).",
      "L'inhalation humide tiède offre un soulagement décongestionnant immédiat.",
    ],
    sections: [
      {
        title: "Quelles sont les causes courantes de la toux sèche ?",
        content: [
          "La toux sèche, dite toux d'irritation, survient lorsque les muqueuses pharyngées ou trachéales sont inflammées sans production de mucus. Elle est particulièrement fatigante car elle ne soulage pas les voies respiratoires et a tendance à s'auto-entretenir.",
          "Les déclencheurs habituels incluent l'air sec intérieur chauffé ou climatisé, les changements de saison, les infections virales bénignes ou l'inhalation de particules irritantes.",
        ],
        tips: [
          "Humidifiez l'atmosphère de votre chambre avec un bol d'eau tiède ou un diffuseur.",
          "Buvez régulièrement des tisanes tièdes au miel ou à l'hibiscus pour lubrifier la gorge.",
        ],
      },
      {
        title: "Le Top 3 des huiles essentielles souveraines",
        content: [
          "1. L'huile essentielle de Ravintsara (Cinnamomum camphora à cinéole) : emblème de la flore malgache, elle est incontournable pour son action antivirale puissante et sa remarquable tolérance cutanée lorsqu'elle est diluée.",
          "2. L'huile essentielle de Cyprès toujours vert : réputée en phytothérapie pour ses vertus calmantes sur le réflexe de toux spasmodique et quinteuse.",
          "3. L'huile essentielle de Lavande vraie : apporte une action sédative, relaxante et anti-inflammatoire, idéale en fin de journée pour calmer les accès nocturnes.",
        ],
      },
      {
        title: "Comment réaliser son baume respiratoire pectoral ?",
        content: [
          "Pour profiter des bienfaits sans agresser la peau, la voie cutanée diluée sur le thorax et le haut du dos est la méthode royale pour les adultes.",
        ],
        tips: [
          "Mélangez 2 cuillères à soupe de Chantilly de Karité ou d'Huile d'Avocat.",
          "Ajoutez 3 gouttes d'HE de Ravintsara et 2 gouttes d'HE de Lavande vraie.",
          "Massez délicatement la poitrine et la voûte plantaire avant le coucher.",
        ],
      },
      {
        title: "Précautions essentielles et contre-indications",
        content: [
          "Les huiles essentielles sont des concentrés moléculaires puissants. Elles sont déconseillées aux femmes enceintes ou allaitantes, ainsi qu'aux enfants de moins de 6 ans sans avis médical spécialisé.",
          "Réalisez systématiquement un test de tolérance dans le pli du coude 24h avant votre première application.",
        ],
      },
    ],
    expertQuote: {
      text: "La flore de Madagascar nous offre avec le Ravintsara une huile essentielle d'une pureté exceptionnelle. Sa richesse en cinéole en fait le bouclier respiratoire par excellence de chaque foyer.",
      author: "Dr. Faniry R.",
      role: "Docteur en Pharmacie & Conseillère en phyto-aromathérapie",
    },
    promotedProducts: [
      {
        name: "HE Ravintsara 10ml",
        tagline: "Le bouclier immunitaire & respiratoire de Madagascar",
        description: "100% pure et naturelle, distillée à partir de feuilles fraîches sélectionnées sur les hauts plateaux.",
        image: "/products/huile-ravintsara.jpeg",
        catalogCategory: "HUILES_ESSENTIELLES",
        recommendedUse: "2 à 3 gouttes diluées dans une cuillère d'huile végétale en onction sur le thorax.",
        badge: "Indispensable Hiver",
      },
      {
        name: "HE cyprès 10ml",
        tagline: "Calmant du réflexe de toux d'irritation",
        description: "Idéale pour apaiser les quintes persistantes et favoriser le confort de la gorge.",
        image: "/products/huile-cypres.jpeg",
        catalogCategory: "HUILES_ESSENTIELLES",
        recommendedUse: "En diffusion douce ou diluée dans un baume pectoral.",
        badge: "Recommandé",
      },
      {
        name: "Huile d'Avocat 100ml",
        tagline: "Huile végétale porteuse ultra-nourrissante",
        description: "Adoucit immédiatement la peau et permet une pénétration optimale des huiles essentielles.",
        image: "/products/huile-avocat.jpeg",
        catalogCategory: "CORPS",
        recommendedUse: "Base de massage neutre pour diluer vos essences aromatiques.",
      },
    ],
    relatedArticleSlugs: [
      "soulager-maux-de-tete-naturellement",
      "routine-anti-chute-fortifiante-cheveux",
      "choisir-associer-serums-huiles-visage",
    ],
  },
  {
    id: "2",
    slug: "soulager-maux-de-tete-naturellement",
    categorySlug: "aromatherapie",
    categoryName: "Conseils Aromathérapie",
    title: "Maux de tête & tensions : quelles huiles essentielles choisir ?",
    subtitle: "L'effet fraîcheur et décongestionnant ciblé pour libérer les tempes et dissiper les lourdeurs.",
    intro:
      "Stress de la journée, fatigue oculaire ou sinus encombrés : les maux de tête peuvent gâcher le quotidien. Avant de recourir systématiquement aux molécules de synthèse, certaines essences végétales procurent un soulagement rapide et ciblé.",
    heroImage: "/products/huile-menthe-poivree.jpeg",
    readTime: "4 min de lecture",
    publishedDate: "18 Octobre 2026",
    updatedDate: "21 Octobre 2026",
    author: {
      name: "Équipe Botanique Lady Gasy",
      role: "Naturopathes",
    },
    keyTakeaways: [
      "La Menthe poivrée procure un effet anesthésiant par le froid grâce à sa haute teneur en menthol.",
      "La Lavande vraie détend les crispations nerveuses et musculaires de la nuque.",
      "Appliquez très loin des yeux pour éviter tout picotement oculaire.",
    ],
    sections: [
      {
        title: "Pourquoi la Menthe poivrée est-elle si performante ?",
        content: [
          "Le menthol active les thermorécepteurs du froid au niveau de la peau, entraînant une vasoconstriction rapide suivie d'un apaisement immédiat du message douloureux.",
          "Associée à la Lavande qui relaxe les trapèzes souvent contractés en cas de céphalée de tension, le duo forme un remède de poche imbattable.",
        ],
        tips: [
          "Diluez 1 goutte d'HE de menthe poivrée dans 3 gouttes d'huile de jojoba.",
          "Massez en petits cercles sur les tempes (à bonne distance des yeux) et sur la base du crâne.",
        ],
      },
    ],
    promotedProducts: [
      {
        name: "HE menthe poivrée 10ml",
        tagline: "Effet glaçon & clarté immédiate",
        description: "Concentrée en menthol pour dissiper les céphalées et les coups de pompe.",
        image: "/products/huile-menthe-poivree.jpeg",
        catalogCategory: "HUILES_ESSENTIELLES",
        recommendedUse: "1 goutte diluée en massage délicat sur les tempes.",
        badge: "Coup de Cœur",
      },
      {
        name: "HE lavande vraie 10ml",
        tagline: "Apaisement nerveux et musculaire",
        description: "Détend les tensions de la nuque et favorise la relaxation globale.",
        image: "/products/huile-lavande.jpeg",
        catalogCategory: "HUILES_ESSENTIELLES",
        recommendedUse: "En massage le long des vertèbres cervicales.",
      },
    ],
    relatedArticleSlugs: [
      "apaiser-toux-seche-huiles-essentielles",
      "choisir-associer-serums-huiles-visage",
    ],
  },
  {
    id: "3",
    slug: "routine-anti-chute-fortifiante-cheveux",
    categorySlug: "cheveux",
    categoryName: "Soins & Pousse des Cheveux",
    title: "Comment accélérer la pousse et freiner la chute des cheveux naturellement ?",
    subtitle: "Notre protocole complet combinant bain d'huiles, massage crânien et actifs fortifiants.",
    intro:
      "Perte de densité, changement de saison ou casse mécanique : redonnez vie et vigueur à votre chevelure grâce à une synergie botanique stimulante qui réveille les follicules pileux au niveau du bulbe.",
    heroImage: "/products/huile-cheveux-ninaka.jpeg",
    readTime: "6 min de lecture",
    publishedDate: "05 Octobre 2026",
    updatedDate: "19 Octobre 2026",
    author: {
      name: "Équipe Botanique Lady Gasy",
      role: "Expertes Capillaires",
    },
    keyTakeaways: [
      "Le massage du cuir chevelu 5 minutes par jour stimule la microcirculation et double l'efficacité des soins.",
      "Le Ricin et le Fenugrec apportent les nutriments lipidiques indispensables à la gaine de kératine.",
      "Le Romarin tonifie le follicule et ralentit la chute saisonnière.",
    ],
    sections: [
      {
        title: "La méthode du bain d'huile stimulant pré-shampoing",
        content: [
          "Appliquer une huile fortifiante sur les racines une fois par semaine permet d'oxygéner le cuir chevelu et d'assouplir les tissus pour que le cheveu s'ancre solidement.",
          "Faites chauffer légèrement l'huile entre vos paumes, séparez vos cheveux en 4 sections et appliquez raie par raie.",
        ],
        tips: [
          "Effectuez des mouvements circulaires avec la pulpe des doigts sans frotter.",
          "Laissez poser au moins 30 minutes sous un bonnet en satin avant de procéder au shampoing.",
        ],
      },
    ],
    diyRecipe: {
      title: "Sérum booster de racines Romarin & Ricin",
      duration: "5 min de préparation",
      difficulty: "Facile",
      ingredients: [
        "2 c. à soupe d'Huile de Ricin",
        "2 c. à soupe d'Huile d'Avocat",
        "4 gouttes d'HE de Romarin",
      ],
      instructions: [
        "Mélangez les huiles végétales dans un flacon propre.",
        "Ajoutez l'huile essentielle de romarin.",
        "Secouez et appliquez 2 fois par semaine sur le cuir chevelu.",
      ],
    },
    promotedProducts: [
      {
        name: "Huile anti-chute fortifiante Ninaka 100ml",
        tagline: "La pépite capillaire Lady Gasy best-seller",
        description: "Formule ancestrale enrichie en extraits botaniques locaux pour stopper la chute et stimuler une repousse vigoureuse.",
        image: "/products/huile-cheveux-ninaka.jpeg",
        catalogCategory: "CHEVEUX",
        recommendedUse: "En bain d'huile hebdomadaire et massage localisé.",
        badge: "N°1 Pousse",
      },
      {
        name: "Huile de Ricin 100ml",
        tagline: "Densité, force et brillance",
        description: "Épaisse et riche en acide ricinoléique, elle gaine la tige et nourrit les pointes sèches.",
        image: "/products/huile-ricin.jpeg",
        catalogCategory: "CHEVEUX",
        recommendedUse: "En friction ciblée sur les tempes ou les longueurs abîmées.",
      },
    ],
    relatedArticleSlugs: [
      "bienfaits-argile-visage-cheveux",
      "apaiser-toux-seche-huiles-essentielles",
    ],
  },
  {
    id: "4",
    slug: "choisir-associer-serums-huiles-visage",
    categorySlug: "beaute",
    categoryName: "Astuces Beauté & Peau",
    title: "Comment bien choisir et combiner ses huiles végétales pour le visage ?",
    subtitle: "Réguler, illuminer, réparer : à chaque besoin cutané son élixir botanique idéal.",
    intro:
      "Fini le mythe selon lequel l'huile fait briller ou obstrue les pores : choisie selon son indice comédogène et ses acides gras, une huile végétale pure est le meilleur soin hydratant et équilibrant qui soit.",
    heroImage: "/products/huile-jojoba.jpg",
    readTime: "5 min de lecture",
    publishedDate: "10 Octobre 2026",
    updatedDate: "22 Octobre 2026",
    author: {
      name: "Équipe Botanique Lady Gasy",
      role: "Cosmétologues Botaniques",
    },
    keyTakeaways: [
      "Le Jojoba mime le sébum naturel : il convient à toutes les peaux, y compris grasses et mixtes.",
      "Toujours appliquer votre huile sur peau propre et encore légèrement humide (après un hydrolat ou brumisateur).",
      "Quelques gouttes suffisent amplement : 2 à 4 gouttes chauffées dans les mains.",
    ],
    sections: [
      {
        title: "Le bon choix selon votre typologie de peau",
        content: [
          "• Peaux mixtes à grasses : Huile de Jojoba ou de Nigelle. Elles rééquilibrent la production sébacée sans laisser de fini gras.",
          "• Peaux sèches ou matures : Huile d'Argan ou d'Avocat, ultra-riches en antioxydants, stérols et acides gras réparateurs.",
          "• Taches et manque d'éclat : Savon anti-tache doux et huile végétale de pépins de raisin.",
        ],
      },
    ],
    promotedProducts: [
      {
        name: "Huile de Jojoba 50ml",
        tagline: "L'équilibrante universelle régulatrice de sébum",
        description: "Toucher sec remarquable, pénètre instantanément sans effet collant.",
        image: "/products/huile-jojoba.jpg",
        catalogCategory: "VISAGE",
        recommendedUse: "3 gouttes matin et soir en massage ascendant sur le visage.",
        badge: "Indispensable",
      },
      {
        name: "Savon anti-tache",
        tagline: "Teint unifié et éclat naturel",
        description: "Nettoie en douceur et estompe les irrégularités pigmentaires.",
        image: "/products/savon-anti-tache.jpeg",
        catalogCategory: "VISAGE",
        recommendedUse: "À utiliser quotidiennement pour un nettoyage respectueux de la barrière cutanée.",
      },
    ],
    relatedArticleSlugs: [
      "bienfaits-argile-visage-cheveux",
      "routine-anti-chute-fortifiante-cheveux",
    ],
  },
  {
    id: "5",
    slug: "bienfaits-argile-visage-cheveux",
    categorySlug: "actifs-naturels",
    categoryName: "Actifs Naturels & Poudres",
    title: "Argiles blanche, verte et Rhassoul : le guide des terres sacrées",
    subtitle: "Purifier les impuretés, apaiser le cuir chevelu et régénérer l'épiderme en douceur.",
    intro:
      "Utilisées depuis l'Antiquité, les argiles minérales et le rhassoul agissent comme de véritables aimants à toxines. Découvrez quelle terre correspond précisément à votre peau et comment préparer vos cataplasmes sans commettre d'erreur.",
    heroImage: "/products/rhassoul.jpeg",
    readTime: "5 min de lecture",
    publishedDate: "02 Octobre 2026",
    updatedDate: "15 Octobre 2026",
    author: {
      name: "Équipe Botanique Lady Gasy",
      role: "Naturopathes",
    },
    keyTakeaways: [
      "Ne jamais laisser sécher l'argile sur la peau : une argile sèche déshydrate les tissus cutanés.",
      "Ne pas utiliser d'ustensiles en métal pour ne pas altérer les propriétés électrostatiques des argiles.",
      "Le Rhassoul est le champion du lavage doux sans tensioactif pour le cuir chevelu sensible.",
    ],
    sections: [
      {
        title: "Comment préparer un masque à l'argile dans les règles de l'art",
        content: [
          "Versez 2 cuillères de poudre dans un bol en bois ou céramique.",
          "Ajoutez lentement de l'eau tiède ou un hydrolat jusqu'à consistance crémeuse.",
          "Ajoutez une demi-cuillère d'huile végétale nourrissante pour éviter tout tiraillement.",
        ],
      },
    ],
    promotedProducts: [
      {
        name: "Rhassoul 200g",
        tagline: "La terre lavante purifiante d'exception",
        description: "Nettoie la peau et les cheveux en douceur sans agresser le film hydrolipidique.",
        image: "/products/rhassoul.jpeg",
        catalogCategory: "CORPS",
        recommendedUse: "En shampoing détoxifiant ou masque gommant visage et corps.",
        badge: "Tradition",
      },
      {
        name: "Poudre d'Argile Blanche 100g",
        tagline: "Douceur extrême pour peaux délicates",
        description: "Reminéralisante, décongestionnante et idéale pour les épidermes sensibles.",
        image: "/products/poudre-argile-blanche.jpeg",
        catalogCategory: "VISAGE",
        recommendedUse: "Masque minute 10 minutes en maintenant humide.",
      },
    ],
    relatedArticleSlugs: [
      "choisir-associer-serums-huiles-visage",
      "routine-anti-chute-fortifiante-cheveux",
    ],
  },
  {
    id: "6",
    slug: "eloigner-moustiques-naturellement-huiles-essentielles",
    categorySlug: "aromatherapie",
    categoryName: "Conseils Aromathérapie",
    title: "Répulsif moustiques & piqûres : les meilleures solutions végétales",
    subtitle: "Profiter des soirées estivales en toute sérénité grâce aux vertus de la citronnelle et du géranium.",
    intro:
      "À Madagascar comme sous tous les climats chauds, les moustiques peuvent vite troubler les moments de quiétude. Découvrez comment créer votre lotion répulsive saine et naturelle sans pesticides nocifs.",
    heroImage: "/products/huile-citronnelle.jpeg",
    readTime: "4 min de lecture",
    publishedDate: "15 Octobre 2026",
    updatedDate: "22 Octobre 2026",
    author: {
      name: "Équipe Botanique Lady Gasy",
      role: "Aromathérapeutes",
    },
    keyTakeaways: [
      "L'HE de Citronnelle contient du citronellal qui désoriente le système olfactif des insectes.",
      "Le Géranium rosat renforce la tenue de la protection sur la peau.",
      "En cas de piqûre : une touche de Lavande vraie apaise la démangeaison en quelques secondes.",
    ],
    sections: [
      {
        title: "Recette du spray protecteur minute",
        content: [
          "Mélangez 30ml d'huile végétale d'amande douce ou d'alcool végétal neutre avec 15 gouttes d'HE de citronnelle et 10 gouttes d'HE de géranium.",
          "Appliquez sur les chevilles, avant-bras et zones exposées avant le coucher du soleil.",
        ],
      },
    ],
    promotedProducts: [
      {
        name: "HE citronnelle 10ml",
        tagline: "Le bouclier anti-moustiques 100% naturel",
        description: "Puissante odeur citronnée répulsive pour préserver vos soirées et vos nuits.",
        image: "/products/huile-citronnelle.jpeg",
        catalogCategory: "HUILES_ESSENTIELLES",
        recommendedUse: "En diffusion atmosphérique ou diluée en application locale.",
        badge: "Incontournable",
      },
      {
        name: "HE lavande vraie 10ml",
        tagline: "Apaisement immédiat post-piqûre",
        description: "Calme l'inflammation et supprime l'envie de gratter.",
        image: "/products/huile-lavande.jpeg",
        catalogCategory: "HUILES_ESSENTIELLES",
        recommendedUse: "1 goutte pure directement sur le bouton de moustique.",
      },
    ],
    relatedArticleSlugs: [
      "apaiser-toux-seche-huiles-essentielles",
      "soulager-maux-de-tete-naturellement",
    ],
  },
];
