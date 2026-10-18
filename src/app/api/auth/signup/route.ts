import { NextResponse } from "next/server";
import pool from "@/data/db";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { nom, prenom, email, telephone, password } = await req.json();

    if (!email || !password || !nom) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    const existing = await pool.query(
      "SELECT id FROM utilisateurs WHERE LOWER(email) = $1",
      [cleanEmail]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Un compte avec cette adresse email existe déjà." },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);

    const insertResult = await pool.query(
      `INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, role)
       VALUES ($1, $2, $3, $4, $5, 'CLIENT')
       RETURNING id, nom, prenom, email, telephone, role`,
      [nom.trim(), prenom?.trim() || "", cleanEmail, telephone?.trim() || "", hashedPassword]
    );

    const newUser = insertResult.rows[0];

    return NextResponse.json({
      success: true,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Erreur Inscription Postgres:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de l'inscription." },
      { status: 500 }
    );
  }
}
