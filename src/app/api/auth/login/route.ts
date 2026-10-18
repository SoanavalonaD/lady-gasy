import { NextResponse } from "next/server";
import pool from "@/data/db";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre email et mot de passe." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const hashedPassword = hashPassword(password);

    const result = await pool.query(
      `SELECT id, nom, prenom, email, telephone, role, mot_de_passe
       FROM utilisateurs
       WHERE LOWER(email) = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Adresse email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Vérification du mot de passe si présent
    if (user.mot_de_passe && user.mot_de_passe !== hashedPassword) {
      return NextResponse.json(
        { error: "Adresse email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Erreur Connexion Postgres:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}
