export type SalonCategoryId =
  | "SOINS_CHEVEUX"
  | "COUPE_CHEVEUX"
  | "TRESSES"
  | "EPILATION"
  | "MASSAGE"
  | "SOIN_VISAGE"
  | "ONGLERIE";

export interface SalonCategory {
  id: SalonCategoryId;
  label: string;
  description: string;
  comingSoon?: boolean;
  /** Affiche les prestations regroupées par sous-catégorie (technique) */
  groupBySubcategory?: boolean;
}

/** Titres et descriptions des sous-catégories (clé = valeur de `subcategory`) */
export const SALON_SUBCATEGORIES: Record<string, { title: string; tagline?: string; description: string }> = {
  "COUPE PRO - SHAPING CUT - MISE EN FORME": {
    title: "Shaping Cut – Mise en forme",
    tagline: "Coupe pro",
    description:
      "Une coupe sur-mesure qui respecte le tombé naturel et le dessin de vos boucles pour une forme harmonieuse et facile à coiffer au quotidien.",
  },
  "COUPE PRO - COUPE VOLUME MAX - EFFET CASCADE": {
    title: "Coupe Volume Max – Effet Cascade",
    tagline: "Coupe pro",
    description:
      "Un dégradé en cascade étudié pour décupler le volume, alléger les masses et donner du rebond à chaque boucle.",
  },
  "SOINS & STYLING CHEVEUX": {
    title: "Soins naturels & Styling",
    tagline: "Rituel capillaire",
    description: "Prestations de soin, démêlage, lavage et mise en beauté naturelle de vos boucles.",
  },
};

/** Ordre d'affichage des catégories de prestations du salon */
export const SALON_CATEGORIES: SalonCategory[] = [
  {
    id: "SOINS_CHEVEUX",
    label: "Soins naturels pour cheveux",
    description: "Démêlage doux, lavage purifiant, soin complet botanique et styling pour cheveux ondulés, bouclés, frisés et crépus.",
    groupBySubcategory: false,
  },
  {
    id: "COUPE_CHEVEUX",
    label: "Coupe cheveux",
    description: "Coupes expertes sur-mesure : Shaping Cut – Mise en forme et Coupe Volume Max – Effet Cascade.",
    groupBySubcategory: true,
  },
  {
    id: "TRESSES",
    label: "Tresses",
    description: "Tresses et coiffures protectrices réalisées avec soin pour préserver vos longueurs.",
  },
  {
    id: "EPILATION",
    label: "Épilation",
    description: "Une épilation douce et respectueuse de la peau.",
    comingSoon: true,
  },
  {
    id: "MASSAGE",
    label: "Massage",
    description: "Des massages relaxants aux huiles végétales et essentielles de Madagascar.",
    comingSoon: true,
  },
  {
    id: "SOIN_VISAGE",
    label: "Soin du visage",
    description: "Des soins du visage naturels pour une peau nette, nourrie et lumineuse.",
    comingSoon: true,
  },
  {
    id: "ONGLERIE",
    label: "Onglerie",
    description: "Manucure, pédicure, poses et nail art réalisés avec minutie.",
  },
];

export interface SalonServiceItem {
  id: string;
  category: SalonCategoryId;
  subcategory: string;
  service: string;
  price: string;
  note?: string;
  description?: string;
  badge?: string;
  image?: string;
  images?: string[];
}

export const SALON_SERVICES: SalonServiceItem[] = [
  // 1. SOINS NATURELS POUR CHEVEUX
  {
    id: "demelage-salon",
    category: "SOINS_CHEVEUX",
    subcategory: "SOINS & STYLING CHEVEUX",
    service: "Démêlage doux au salon",
    price: "+ 5 000 Ar",
    note: "En supplément",
    description: "Démêlage minutieux aux huiles végétales et crèmes botaniques sans douleur ni casse.",
  },
  {
    id: "lavage-demelage",
    category: "SOINS_CHEVEUX",
    subcategory: "SOINS & STYLING CHEVEUX",
    service: "Lavage + Démêlage",
    price: "13 000 Ar",
    note: "À partir de",
    description: "Shampoing purifiant doux, soin démêlant hydratant et massage relaxant du cuir chevelu.",
    badge: "Essentiel",
  },
  {
    id: "soin-complet-cheveux",
    category: "SOINS_CHEVEUX",
    subcategory: "SOINS & STYLING CHEVEUX",
    service: "Soin complet",
    price: "Sur devis",
    note: "Selon longueur & densité",
    description: "Rituel profond 100% naturel (bain d'huiles, masque botanique sous vapeur douce, hydratation et scellage) pour régénérer la fibre capillaire.",
    badge: "Rituel profond",
  },
  {
    id: "styling-cheveux",
    category: "SOINS_CHEVEUX",
    subcategory: "SOINS & STYLING CHEVEUX",
    service: "Styling",
    price: "Sur devis",
    note: "Selon longueur & technique",
    description: "Définition et mise en forme des boucles (Wash & Go, Finger Coils, Twist-out, Braid-out) avec nos soins coiffants naturels.",
    badge: "Définition",
  },

  // 2. COUPE CHEVEUX (Shaping Cut & Coupe Volume Max)
  {
    id: "coupe-shaping-courts",
    category: "COUPE_CHEVEUX",
    subcategory: "COUPE PRO - SHAPING CUT - MISE EN FORME",
    service: "Cheveux courts et mi-longs",
    price: "30 000 Ar",
    description: "Diagnostic de texture, coupe sur cheveux secs ou humides respectant le tombant naturel et le dessin de vos boucles.",
    badge: "Populaire",
  },
  {
    id: "coupe-shaping-longs",
    category: "COUPE_CHEVEUX",
    subcategory: "COUPE PRO - SHAPING CUT - MISE EN FORME",
    service: "Cheveux très longs ou denses",
    price: "35 000 Ar",
    description: "Harmonisation globale des volumes, allègement des masses et redéfinition du rebond pour chevelures épaisses.",
  },
  {
    id: "coupe-volume-cascade-milongs",
    category: "COUPE_CHEVEUX",
    subcategory: "COUPE PRO - COUPE VOLUME MAX - EFFET CASCADE",
    service: "Cheveux mi-longs",
    price: "40 000 Ar",
    description: "Technique de dégradé en cascade étudiée pour décupler le volume et dynamiser chaque mèche.",
    badge: "Signature",
  },
  {
    id: "coupe-volume-cascade-longs",
    category: "COUPE_CHEVEUX",
    subcategory: "COUPE PRO - COUPE VOLUME MAX - EFFET CASCADE",
    service: "Cheveux très longs ou denses",
    price: "45 000 Ar",
    description: "Effet cascade spectaculaire et aéré, structuré pour offrir légèreté, mouvement et volume longue tenue.",
    badge: "Tendance",
  },

  // ONGLERIE
  {
    id: "manucure-russe",
    category: "ONGLERIE",
    subcategory: "SOINS DES ONGLES",
    service: "Manucure Russe",
    price: "15 000 Ar",
    note: "À partir de",
    description: "Nettoyage approfondi des cuticules à la ponceuse pour un pourtour d'ongle ultra-net et raffiné.",
    badge: "Incontournable",
  },
  {
    id: "pedicure-complete",
    category: "ONGLERIE",
    subcategory: "SOINS DES PIEDS",
    service: "Pédicure Complète",
    price: "25 000 Ar",
    note: "À partir de",
    description: "Bain délassant, gommage exfoliant aux huiles, soin des callosités, limage et hydratation profonde.",
    badge: "Bien-être",
  },
  {
    id: "extension-chablon",
    category: "ONGLERIE",
    subcategory: "POSES & EXTENSIONS",
    service: "Extension sur chablon avec pose vernis uni",
    price: "35 000 Ar",
    note: "À partir de",
    description: "Rallongement sur-mesure sans capsules pour un résultat robuste, léger et totalement naturel.",
  },
  {
    id: "gainage",
    category: "ONGLERIE",
    subcategory: "POSES & EXTENSIONS",
    service: "Gainage",
    price: "20 000 Ar",
    note: "À partir de",
    description: "Renforcement de l'ongle naturel avec une fine couche protectrice pour éviter le dédoublement et la casse.",
  },
  {
    id: "polygel",
    category: "ONGLERIE",
    subcategory: "POSES & EXTENSIONS",
    service: "Pose Polygel",
    price: "40 000 Ar",
    note: "À partir de",
    description: "La combinaison parfaite entre la légèreté du gel et la résistance de la résine.",
  },
  {
    id: "pose-americaine",
    category: "ONGLERIE",
    subcategory: "POSES & EXTENSIONS",
    service: "Pose Américaine (Gel X)",
    price: "25 000 Ar",
    note: "À partir de",
    description: "Capsules en gel posées sur la totalité de l'ongle pour une tenue impeccable de plusieurs semaines.",
    badge: "Best-seller",
  },
  {
    id: "vernis-semi-permanent",
    category: "ONGLERIE",
    subcategory: "VERNIS & COULEURS",
    service: "Pose Vernis Semi-Permanent",
    price: "10 000 Ar",
    note: "À partir de",
    description: "Couleur éclatante, séchage sous lampe LED et tenue sans écaillage jusqu'à 3 semaines.",
  },
  {
    id: "vernis-oeil-de-chat",
    category: "ONGLERIE",
    subcategory: "VERNIS & COULEURS",
    service: "Pose Vernis Œil de Chat (avec ou sans déco)",
    price: "20 000 Ar",
    note: "À partir de",
    description: "Effet magnétique chatoyant captivant créant des reflets veloutés et profonds.",
  },
  {
    id: "baby-boomer",
    category: "ONGLERIE",
    subcategory: "VERNIS & COULEURS",
    service: "Pose Baby Boomer",
    price: "18 000 Ar",
    note: "À partir de",
    description: "Dégradé fondu chic et naturel entre le blanc et le rose poudré.",
  },
  {
    id: "blooming-gel",
    category: "ONGLERIE",
    subcategory: "STYLISME & NAIL ART",
    service: "Blooming Gel",
    price: "1 500 Ar",
    note: "À partir de",
    description: "Effet d'aquarelle florale ou marbrée qui se diffuse avec élégance sur l'ongle.",
  },
  {
    id: "nail-art",
    category: "ONGLERIE",
    subcategory: "STYLISME & NAIL ART",
    service: "Nail Art personnalisé",
    price: "500 Ar",
    note: "À partir de / par ongle",
    description: "Dessins fins, lignes graphiques, paillettes ou motifs sur-mesure réalisés à la main.",
  },
  {
    id: "pose-faux-ongles",
    category: "ONGLERIE",
    subcategory: "POSES & EXTENSIONS",
    service: "Pose Faux Ongles Express",
    price: "5 000 Ar",
    note: "À partir de",
    description: "Pose rapide et soignée de capsules pour une occasion particulière.",
  },
  {
    id: "depose",
    category: "ONGLERIE",
    subcategory: "SOINS DES ONGLES",
    service: "Dépose douce",
    price: "0 Ar",
    note: "Gratuit si fait au salon (ou petit forfait)",
    description: "Retrait délicat sans ponçage agressif pour préserver la santé de la matrice ongulaire.",
  },
];

export const SALON_TESTIMONIALS = [
  {
    quote: "C'est un parfait allié pour réussir son retour au naturel et consommer local en toute confiance ! Des produits d'exception et une équipe qui comprend réellement chaque boucle.",
    author: "Anah Rabe",
    role: "Cliente fidèle · 100% Satisfaite",
  },
  {
    quote: "De vrais spécialistes de la boucle et des cheveux texturés à Madagascar ! Coupe à sec précise, clarification au bac avec massage crânien relaxant, et les produits Lady Gasy sont juste une merveille.",
    author: "Toukh Rand",
    role: "Cliente Salon Lady Gasy",
  },
  {
    quote: "These experts are real hair doctors! I highly recommend making use of their organic products and salon services regardless of your hair texture. Service au top !",
    author: "Sarah L.",
    role: "Natural Hair Enthusiast",
  },
];
