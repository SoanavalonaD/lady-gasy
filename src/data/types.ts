export interface Product {
  id: string; // UUID from Supabase
  name: string;
  description: string;
  priceEur: number;
  priceAr: number;
  image: string;
  needs?: string[];
  categories?: string[];
  rawCategory?: string;
  ingredients?: string;
  usage?: string[];
  rating?: number;
  reviewsCount?: number;
  stock?: number;
}
