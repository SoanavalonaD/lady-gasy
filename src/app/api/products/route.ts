import { NextResponse } from "next/server";
import pool from "@/data/db";
import {
  getStoredProductImagesMap,
  parseImageArray,
} from "@/data/imageStore";

export async function GET() {
  try {
    const [result, storedMap] = await Promise.all([
      pool.query(
        "SELECT id, nom_produit, description, categorie, prix, stock_disponible, image_url FROM produits ORDER BY cree_le DESC"
      ),
      getStoredProductImagesMap(),
    ]);

    const rows = result.rows.map((row: any) => {
      const dbImages = parseImageArray(row.image_url);
      const codeImages = storedMap[row.id];
      const finalImages =
        codeImages && codeImages.length >= dbImages.length && codeImages.length > 0
          ? codeImages
          : dbImages.length > 0
            ? dbImages
            : ["/background-image.jpg"];

      return {
        ...row,
        image_url:
          finalImages.length === 1
            ? finalImages[0]
            : JSON.stringify(finalImages),
        images: finalImages,
      };
    });

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Erreur Postgres:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
