export interface Product {
  id: string;
  name: string;
  price: number; // in Ariary (Ar)
  category: string; // 'Hydratation' | 'Volume & Boucles' | 'Accessoires'
  concern: string; // E.g., 'Cheveux secs & crépus', 'Stimule & Fortifie'
  description: string;
  image: string;
  detailsImage?: string;
  isNew?: boolean;
  features?: string[];
}

export const products: Product[] = [
  {
    id: "shampoing-karite",
    name: "Shampoing Solide Karité",
    price: 28000,
    category: "Hydratation",
    concern: "Cheveux secs & crépus",
    description: "Un concentré de nutrition pour vos cheveux. Formulé avec du beurre de karité bio non raffiné, ce shampoing solide nettoie en douceur tout en respectant le cuir chevelu. Son parfum naturel de ylang-ylang apporte une touche sensorielle apaisante.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwLH8DmNYYy8PwJV0sYM_GQNMLmZnhDWwkfGkywYmCjh5mmxz8lMk2BU8DsZpU6sdUypMAHA8TL-C5IWLzjfu8A8YK11TUiltg7lsWEnQr-jTTv1N00Z8epbvk960Oqeymji-tz7k9wBVaC245zcmqQAtG6Ndqz5Urf-KgAZhZx6GdjMDXFzFHeNCW-3rf28Rpco1Ni2jYl_laWIdgXVV0wly55YsZxYw1qgb6WGWFSUIKWOHo_gdd7CJ7wOn2ThBNw",
    detailsImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw01ekYz400SzCZi78Lj4rZu8M-bYkZYzsGTc5t6VNh2i_r1ehJwlFARlQbrUkZjh1ZF1-jYBY6AGeZ8ZBYa6RvGGwPCNeJHKu0gbZHNef5f_RZZW9ODl9bh-b4sa4fCsePVzW_9-sJKLugt-dXNwfzNyvfBqvjJ_cUHDkD8SH2kzHS1cvxGXDq-FNUBl1G7xYSIyAUufTdZqk0qIH1yDHyxP9_HP2jWqt0pVdt0_8GGGpppqHItzHUe33PAn2gqlWiw",
    features: [
      "100% Ingrédients d'origine naturelle",
      "Végan & Non testé sur les animaux",
      "Format écologique zéro déchet"
    ]
  },
  {
    id: "creme-baobab",
    name: "Crème Hydratante Baobab",
    price: 45000,
    category: "Hydratation",
    concern: "Hydratation profonde",
    description: "Une crème de soin sans rinçage d'une texture aérienne et onctueuse, formulée à base d'huile pure de graines de Baobab. Elle scelle l'hydratation, adoucit la fibre capillaire et facilite le coiffage au quotidien.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3S54eIxsuwM-M-NtJ1TLFMqPtYsnQvn3dnhbyJQkmTBPNL0e4UABbkyUA2MNBCrPEsKP11svrTFHfWEaYcsfaRWYe7Jn849yopahK5Za0rA2MOLP406yd7aOBDJYDJ47Yk2howf2_9rphazngtCOy8fnlAxSiHvtpU0hkaualYXCO3WxnV4NRgdF_BQ6vzeQ7v4uy6Bcy2-JhtFWZCnNTAivzkmHp2tItDkXNUJDR6ZFpbmPbvRLi",
    features: [
      "Hydratation intense 24h",
      "Idéal pour sceller l'hydratation",
      "Parfum naturel délicat"
    ]
  },
  {
    id: "serum-baobab",
    name: "Sérum Pousse Baobab",
    price: 45000,
    category: "Volume & Boucles",
    concern: "Stimule & Fortifie",
    description: "Un élixir précieux de plantes malgaches formulé pour stimuler le bulbe capillaire et fortifier la racine. Idéal pour lutter contre la chute des cheveux et favoriser une pousse vigoureuse.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1mFl8CY2PMRss_378i8gcuZYMv30ldpbKTlJxvnJXeLKiOunqja_d-wlWAgU40EQt_mVrJJGVwG5PxeOMUqd9uSAPD7ZUo60boiYZFkMYF8VxfkcrDaj1qCIPuDWoPOD2bn2ChUVkmPQ1niYGbioGKBLWcdLCLmpbVHtQ41kKPXdFuN8wsdA_QlPB5CdnsejRrq-22EudUpUtsJbRWpQXVGwJ4j2gEzN7MNqh56ga7ImRbigqkbOK",
    features: [
      "Favorise la microcirculation du cuir chevelu",
      "Huile de Baobab de première pression à froid",
      "Traitement de 3 mois recommandé"
    ]
  },
  {
    id: "masque-aloe",
    name: "Masque Profond Aloé",
    price: 58000,
    category: "Hydratation",
    concern: "Hydratation intense",
    description: "Un masque de soin revitalisant formulé avec du gel d'Aloe Vera frais et des huiles botaniques. Il pénètre la fibre pour infuser l'eau et redonner de l'élasticité et de la brillance aux cheveux les plus ternes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2GnQD_5CBiQrl25d75mTvf76tPg6AJMxrUrooac2hG4KWYCOr2gQ6duMOoqa2ffByM45DP_gzlIlVzXgSqL9fOA2EL7e31HBdaoP8Py0p7ZZtYarjyOZFKNG1u6pHihXW5ZexLdyAHZyyc9tMVCGtyymwUBq4RiizAVjsoU5C05mjr_H96SvLyNELpy24gWWCBtch-HCl1DaSHfILMv6t8eRkjoZK69UHofLk-qjRrmUu71I6cXVt",
    isNew: true,
    features: [
      "Gel d'Aloe Vera frais et biologique",
      "Démêlage instantané sous la douche",
      "Sans silicones ni sulfates"
    ]
  },
  {
    id: "peigne-neem",
    name: "Peigne en Bois de Neem",
    price: 25000,
    category: "Accessoires",
    concern: "Démêlage en douceur",
    description: "Peigne à dents larges taillé dans du bois de Neem naturel. Antibactérien et antistatique, il glisse dans les boucles sans casser la fibre et stimule en douceur le cuir chevelu pendant le démêlage.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL62oufxUg1tvLbPByu0TqIzBed7gu2R9Y711pCLPlydgHxxIRIUWaxRMV2doqEFJREKYjIBhU5RVdssrulLyr6oOUlEqQtpFUp7tCo63-N3CP3vPtuCx7Cx9JnC3dU9_ewago0zKY_6W-OlDYyuNzXsN_3ccjINkg2K34h-MFfUiv1x2qRL5dbK2Sigw8PuLLka6evwxlnvdJdamopWdr18WPhAgRmLE0rggigJ0GL0M5zp5Vvefx",
    features: [
      "Bois de Neem naturel respectueux de l'environnement",
      "Propriétés antistatiques et apaisantes",
      "Dents larges adaptées aux cheveux bouclés, frisés et crépus"
    ]
  },
  {
    id: "huile-ricin",
    name: "Huile de Ricin Bio",
    price: 25000,
    category: "Volume & Boucles",
    concern: "Soin fortifiant",
    description: "Une huile de ricin pure et biologique, pressée à froid. Elle nourrit en profondeur le bulbe capillaire, favorise la pousse des cheveux et fortifie les longueurs.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFt3IwvP2-UbEZhFt1nzugXeAjHVh-x8OrC_-b7zhpFizUN8Du6UQuDnwmEYpkY5uqirVnYQ5CfMu3rhjaQ2xu5frWAlCt0VF7DD2xseHwJAvAv9AEht-HVd04vZCMupsscmmRhI51w7yJ0oPPcv7xaTofdlNrP-t93RQKqi37n3zvAW28nPZ9SUWg4QdLNpd6vKYevcgAdOlY5LM4OKhrE2k-mG-EnNh9mvMPNP94PsnlDY-W3dAO",
    features: [
      "Huile 100% pure et biologique",
      "Idéal en bain d'huile",
      "Favorise la pousse et densifie"
    ]
  },
  {
    id: "masque-coco",
    name: "Masque Hydratant Coco",
    price: 35000,
    category: "Hydratation",
    concern: "Nutrition intense",
    description: "Un masque capillaire crémeux et onctueux à base d'huile et de lait de coco bio. Il répare intensément les cheveux abîmés, desséchés et cassants.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmLAEF7oIwKc8nhcoXwxr6yuGCctY7VRceQZkgp3CTQl5jFrGtC6uaf8lsDywcZjitv1TcrRcwfmBbXQ4mQf5JmSU0FPea0fsDDpS2h2zB1Zgay9JtQJrHmsiPIU-8Q5-cgygS0ZLVKoXLPYX2jwkgvMSVcCMSzchoVj56MV9duX8Mxsq8GnGJtxKOAXJ_E0sPpY207jRmDmuodrWgkhrHpfiDiipvACLIHT3xMVO1yKcge305NSMN",
    features: [
      "Huile de coco bio pressée à froid",
      "Formule ultra-nourrissante",
      "Redonne douceur et souplesse"
    ]
  },
  {
    id: "brume-aloe",
    name: "Brume Rafraîchissante",
    price: 20000,
    category: "Hydratation",
    concern: "Aloé Vera & Hibiscus",
    description: "Une brume légère pour réveiller et hydrater vos boucles au réveil ou tout au long de la journée. Son association d'aloé vera hydratant et d'hibiscus tonifiant redessine les boucles instantanément.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFyr6pQx2nfh6x1pYb4xIptHur6Qpny35OjvQPSB-Ouegt-esNf2L4LKtZ7MF4HfLxfrJ7iG0pHvCqrM0iabTui4540GrK30P0xzSrIUY0Wx3MMiyKO7rDMFA4QgMp5ztwSbq3yf8cQ7ZTPZD_4YSEJmq1kJphmFLDysXXcNFhQudhARtkAFKSye5bAvgmtCnehxwYr3rwjKRuy3CxX9PkfXzgUZEVe84gAmF6nA_i8Ch4knh6Hf2o",
    features: [
      "Texture non grasse, n'alourdit pas",
      "Hydrate et redessine les boucles",
      "Parfum floral frais"
    ]
  }
];

