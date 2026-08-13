import { supabase } from "./supabase";
import { products } from "./products";

// Map local categories to database enum: 'CHEVEUX', 'ONGLES', 'ACCESSOIRES', 'CILS', 'LEVRES'
function mapCategory(categories?: string[]): "CHEVEUX" | "ACCESSOIRES" | "ONGLES" | "CILS" | "LEVRES" {
  if (!categories || categories.length === 0) return "CHEVEUX";
  const primary = categories[0].toLowerCase();
  if (primary.includes("accessoire")) return "ACCESSOIRES";
  if (primary.includes("ongle")) return "ONGLES";
  if (primary.includes("cil")) return "CILS";
  if (primary.includes("lèvre") || primary.includes("levre")) return "LEVRES";
  return "CHEVEUX";
}

async function seed() {
  console.log("Démarrage du peuplement (seeding) de la table produits...");

  // Check if products already exist
  const { data: existing, error: fetchError } = await supabase
    .from("produits")
    .select("id");

  if (fetchError) {
    console.error("Erreur lors de la vérification de la table produits :", fetchError.message);
    return;
  }

  if (existing && existing.length > 0) {
    console.log(`La table produits contient déjà ${existing.length} produits. Pas besoin de peupler.`);
    return;
  }

  // Prepare database rows
  const dbRows = products.map((p) => ({
    nom_produit: p.name,
    description: p.description,
    categorie: mapCategory(p.categories),
    prix: p.priceAr, // Using local price in Ariary
    stock_disponible: 50, // Default stock level
    image_url: p.image
  }));

  const { data, error } = await supabase
    .from("produits")
    .insert(dbRows)
    .select();

  if (error) {
    console.error("Erreur lors de l'insertion des produits :", error.message);
  } else {
    console.log(`Réussite ! ${data?.length} produits ont été insérés dans la base de données.`);
  }
}

seed().catch((err) => {
  console.error("Erreur critique lors du seeding :", err);
});
