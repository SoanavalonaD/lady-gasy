// Exemple dans une page ou un composant Next.js
import { supabase } from '@/data/supabase';

export async function fetchProduits() {
  const { data: produits, error } = await supabase
    .from('produits')
    .select('*');

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error.message);
    return [];
  }

  return produits;
}