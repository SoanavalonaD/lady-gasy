import type { MetadataRoute } from "next";
import pool from "@/data/db";
import { ADVICE_CATEGORIES, ADVICE_ARTICLES } from "@/data/adviceData";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ladygasy.mg";

  // Pages statiques publiques principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/diy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Catégories de conseils
  const adviceCategoryRoutes: MetadataRoute.Sitemap = ADVICE_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/diy/categorie/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Articles de conseils
  const adviceArticleRoutes: MetadataRoute.Sitemap = ADVICE_ARTICLES.map((art) => ({
    url: `${baseUrl}/diy/article/${art.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Pages dynamiques des produits
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await pool.query(
      "SELECT id, mis_a_jour_le, cree_le FROM produits ORDER BY cree_le DESC"
    );

    interface ProductRow {
      id: string;
      mis_a_jour_le?: string | Date;
      cree_le?: string | Date;
    }

    productRoutes = ((result.rows as ProductRow[]) || []).map((row) => ({
      url: `${baseUrl}/catalogue/${row.id}`,
      lastModified: row.mis_a_jour_le
        ? new Date(row.mis_a_jour_le)
        : row.cree_le
        ? new Date(row.cree_le)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Erreur lors de la génération dynamique du sitemap des produits :", error);
  }

  return [...staticRoutes, ...adviceCategoryRoutes, ...adviceArticleRoutes, ...productRoutes];
}
