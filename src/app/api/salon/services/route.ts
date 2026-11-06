import { NextResponse } from "next/server";
import pool from "@/data/db";
import {
  getStoredSalonImagesMap,
  parseImageArray,
  saveSalonImagesInCode,
} from "@/data/imageStore";

let tableInitialized = false;

async function ensureTableExists() {
  if (tableInitialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS prestations_salon (
      id VARCHAR(150) PRIMARY KEY,
      image_url TEXT,
      mise_a_jour_le TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    )
  `);
  tableInitialized = true;
}

// GET: Récupérer les listes d'images (jusqu'à 3 par prestation) depuis le code (salonImages.json) et PostgreSQL
export async function GET() {
  const codeMap = await getStoredSalonImagesMap();
  try {
    await ensureTableExists();
    const result = await pool.query(
      "SELECT id, image_url, mise_a_jour_le FROM prestations_salon WHERE image_url IS NOT NULL AND image_url <> ''"
    );

    const dbMap: Record<string, string[]> = {};
    for (const row of result.rows) {
      if (row.id && row.image_url) {
        const list = parseImageArray(row.image_url);
        if (list.length > 0) {
          dbMap[row.id] = list;
        }
      }
    }

    return NextResponse.json({ ...dbMap, ...codeMap });
  } catch (error: any) {
    console.warn("Retour sur salonImages.json (PostgreSQL indisponible):", error?.message);
    return NextResponse.json(codeMap);
  }
}

// POST: Enregistrer ou mettre à jour jusqu'à 3 images pour une prestation du salon (dans salonImages.json + PostgreSQL)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, images, image_url } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "L'identifiant de la prestation est requis." },
        { status: 400 }
      );
    }

    const normalizedImages = await saveSalonImagesInCode(
      id,
      images !== undefined ? images : image_url
    );

    try {
      await ensureTableExists();
      if (normalizedImages.length === 0) {
        await pool.query("DELETE FROM prestations_salon WHERE id = $1", [id]);
      } else {
        await pool.query(
          `INSERT INTO prestations_salon (id, image_url, mise_a_jour_le)
           VALUES ($1, $2, timezone('utc'::text, now()))
           ON CONFLICT (id)
           DO UPDATE SET
             image_url = EXCLUDED.image_url,
             mise_a_jour_le = timezone('utc'::text, now())`,
          [id, JSON.stringify(normalizedImages)]
        );
      }
    } catch (dbErr: any) {
      console.warn("Image salon sauvegardée dans salonImages.json (DB warning):", dbErr?.message);
    }

    return NextResponse.json({ id, images: normalizedImages });
  } catch (error: any) {
    console.error("Erreur POST /api/salon/services:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'enregistrement des images." },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer toutes les images d'une prestation (ou une image précise via ?index=0..2)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const indexParam = searchParams.get("index");

    if (!id) {
      return NextResponse.json(
        { error: "Identifiant de prestation manquant." },
        { status: 400 }
      );
    }

    const codeMap = await getStoredSalonImagesMap();
    let currentList = codeMap[id] || [];

    if (currentList.length === 0) {
      try {
        await ensureTableExists();
        const existing = await pool.query(
          "SELECT image_url FROM prestations_salon WHERE id = $1",
          [id]
        );
        if (existing.rows.length > 0) {
          currentList = parseImageArray(existing.rows[0].image_url);
        }
      } catch {
        // Ignore DB error
      }
    }

    const nextList =
      indexParam !== null
        ? currentList.filter((_, i) => i !== Number(indexParam))
        : [];

    await saveSalonImagesInCode(id, nextList);

    try {
      await ensureTableExists();
      if (nextList.length === 0) {
        await pool.query("DELETE FROM prestations_salon WHERE id = $1", [id]);
      } else {
        await pool.query(
          "UPDATE prestations_salon SET image_url = $1, mise_a_jour_le = timezone('utc'::text, now()) WHERE id = $2",
          [JSON.stringify(nextList), id]
        );
      }
    } catch {
      // Ignore DB error
    }

    return NextResponse.json({ success: true, images: nextList });
  } catch (error: any) {
    console.error("Erreur DELETE /api/salon/services:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression de l'image." },
      { status: 500 }
    );
  }
}
