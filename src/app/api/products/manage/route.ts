import { NextResponse } from "next/server";
import pool from "@/data/db";

// POST: Créer un produit
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom_produit, description, categorie, prix, stock_disponible, image_url } = body;

    const result = await pool.query(
      `INSERT INTO produits (nom_produit, description, categorie, prix, stock_disponible, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nom_produit, description, categorie, prix, stock_disponible || 0, image_url]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("Erreur POST admin produit:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du produit." },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Mettre à jour un produit
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, nom_produit, description, categorie, prix, stock_disponible, image_url } = body;

    const result = await pool.query(
      `UPDATE produits 
       SET nom_produit = COALESCE($1, nom_produit),
           description = COALESCE($2, description),
           categorie = COALESCE($3, categorie),
           prix = COALESCE($4, prix),
           stock_disponible = COALESCE($5, stock_disponible),
           image_url = COALESCE($6, image_url)
       WHERE id = $7
       RETURNING *`,
      [nom_produit, description, categorie, prix, stock_disponible, image_url, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("Erreur PATCH admin produit:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour du produit." },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un produit
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });
    }

    await pool.query("DELETE FROM produits WHERE id = $1", [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur DELETE admin produit:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression du produit." },
      { status: 500 }
    );
  }
}
