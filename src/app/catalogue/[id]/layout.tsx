import type { Metadata } from "next";
import pool from "@/data/db";
import { buildPageMetadata } from "@/utils/seo";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const path = `/catalogue/${id}`;

  try {
    const result = await pool.query(
      "SELECT nom_produit, description, image_url FROM produits WHERE id = $1 LIMIT 1",
      [id]
    );
    const product = result.rows[0];
    if (product) {
      const description =
        (product.description || "").replace(/\s+/g, " ").trim().slice(0, 160) ||
        `Découvrez ${product.nom_produit}, un soin naturel Lady Gasy.`;
      return buildPageMetadata({
        title: product.nom_produit,
        description,
        path,
        image: product.image_url || undefined,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la génération des métadonnées produit :", error);
  }

  return buildPageMetadata({
    title: "Produit",
    description: "Découvrez nos soins naturels et bio sur Lady Gasy.",
    path,
  });
}

export default function ProductLayout({ children }: LayoutProps) {
  return children;
}
