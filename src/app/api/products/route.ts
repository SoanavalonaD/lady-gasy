import { NextResponse } from "next/server";
import pool from "@/data/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, nom_produit, description, categorie, prix, stock_disponible, image_url FROM produits ORDER BY cree_le DESC"
    );

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("Erreur Postgres:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
