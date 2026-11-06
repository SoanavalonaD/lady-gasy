import { Product } from "@/data/types";

export interface ProductVariant {
  id: string;
  size: string; // Ex: "100ml", "250ml", "50g" — chaîne vide si la contenance n'est pas détectée dans le nom
  priceAr: number;
  product: Product;
}

export interface GroupedProduct extends Product {
  baseName: string;
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  hasMultipleVariants: boolean;
}

/**
 * Extrait la contenance d'un nom de produit (ex: "100ml", "250ml", "50g", "1l", "1kg", "piece")
 * et retourne le nom de base nettoyé.
 */
export function parseProductQuantity(name: string): { baseName: string; size: string | null } {
  // Regex pour détecter les quantités à la fin ou isolées comme 100ml, 50g, 100g, 1L, etc.
  const regex = /(?:^|\s|-|\()(\d+(?:[.,]\d+)?\s*(?:ml|cl|l|g|kg|pcs|pièce|pieces|pièces))(?:\s*[\)\/]?\s*$|\s*[\)\/])/i;
  
  const match = name.match(regex);
  if (match) {
    const size = match[1].trim();
    // On retire la taille du nom pour obtenir le nom de base
    const baseName = name
      .replace(match[0], " ")
      .replace(/\s+/g, " ")
      .replace(/[\(\)\/\-]$/, "")
      .trim();
    return { baseName, size };
  }

  return { baseName: name.trim(), size: null };
}

/**
 * Regroupe une liste de produits par leur nom de base pour gérer les variantes/déclinaisons de contenance.
 */
export function groupProductsByVariant(products: Product[]): GroupedProduct[] {
  const groups: { [baseKey: string]: Product[] } = {};

  products.forEach((product) => {
    const { baseName } = parseProductQuantity(product.name);
    // Clé unique basée sur le nom de base et la catégorie
    const key = `${(product.rawCategory || "").toUpperCase()}__${baseName.toLowerCase()}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(product);
  });

  return Object.values(groups).map((productList) => {
    // Trier les variantes par prix croissant (la plus petite quantité d'abord)
    const sorted = [...productList].sort((a, b) => a.priceAr - b.priceAr);
    const mainProduct = sorted[0]; // Produit affiché par défaut (format standard ou plus accessible)

    const variants: ProductVariant[] = sorted.map((p) => {
      const { size } = parseProductQuantity(p.name);
      return {
        id: p.id,
        size: size || "", // Ne jamais utiliser le prix comme format
        priceAr: p.priceAr,
        product: p,
      };
    });

    const { baseName } = parseProductQuantity(mainProduct.name);
    const richestImagesVariant = sorted.reduce(
      (best, curr) =>
        (curr.images?.length || 0) > (best.images?.length || 0) ? curr : best,
      mainProduct
    );

    return {
      ...mainProduct,
      image: richestImagesVariant.image || mainProduct.image,
      images: richestImagesVariant.images || mainProduct.images,
      name: variants.length > 1 ? baseName : mainProduct.name, // Affiche le nom épuré si plusieurs formats
      baseName,
      variants,
      selectedVariant: variants[0],
      hasMultipleVariants: variants.length > 1,
    };
  });
}
