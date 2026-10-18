import { NextResponse } from "next/server";
import pool from "@/data/db";

// 1. GET: Récupération de l'historique des commandes (ou toutes si admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const isAdmin = searchParams.get("admin") === "true";

    let query = `
      SELECT 
        c.id,
        c.id_utilisateur,
        c.statut,
        c.montant_total,
        c.date_commande,
        l.adresse_detaillee,
        l.ville,
        l.zone_livraison,
        l.frais_livraison,
        l.repere,
        l.statut as livraison_statut,
        u.nom as client_nom,
        u.prenom as client_prenom,
        u.email as client_email,
        u.telephone as client_telephone
      FROM commandes c
      LEFT JOIN livraisons l ON l.id_commande = c.id
      LEFT JOIN utilisateurs u ON u.id = c.id_utilisateur
    `;

    const params: any[] = [];
    if (!isAdmin && userId) {
      query += ` WHERE c.id_utilisateur = $1`;
      params.push(userId);
    } else if (!isAdmin && !userId) {
      return NextResponse.json([]);
    }

    query += ` ORDER BY c.date_commande DESC`;

    const ordersRes = await pool.query(query, params);

    // Récupérer les lignes de commande pour ces commandes
    const orderIds = ordersRes.rows.map((r: any) => r.id);

    let itemsByOrderId: { [key: string]: any[] } = {};

    if (orderIds.length > 0) {
      const itemsRes = await pool.query(
        `SELECT 
           lc.id_commande,
           lc.id_produit,
           lc.quantite,
           lc.prix_unitaire_applique,
           p.nom_produit,
           p.image_url
         FROM lignes_commande lc
         LEFT JOIN produits p ON p.id = lc.id_produit
         WHERE lc.id_commande = ANY($1::uuid[])`,
        [orderIds]
      );

      itemsRes.rows.forEach((row: any) => {
        if (!itemsByOrderId[row.id_commande]) {
          itemsByOrderId[row.id_commande] = [];
        }
        itemsByOrderId[row.id_commande].push({
          id_produit: row.id_produit,
          nom_produit: row.nom_produit || "Produit Lady Gasy",
          image_url: row.image_url || "/background-image.jpg",
          quantite: row.quantite,
          prix_unitaire_applique: Number(row.prix_unitaire_applique),
        });
      });
    }

    const formattedOrders = ordersRes.rows.map((row: any) => ({
      id: row.id,
      id_utilisateur: row.id_utilisateur,
      statut: row.statut,
      montant_total: Number(row.montant_total),
      date_commande: row.date_commande,
      client: {
        nom: `${row.client_prenom || ""} ${row.client_nom || ""}`.trim() || "Client Invité",
        email: row.client_email || "Non renseigné",
        telephone: row.client_telephone || "Non renseigné",
      },
      items: itemsByOrderId[row.id] || [],
      livraison: row.adresse_detaillee
        ? {
            adresse_detaillee: row.adresse_detaillee,
            ville: row.ville,
            zone_livraison: row.zone_livraison,
            frais_livraison: Number(row.frais_livraison || 0),
            repere: row.repere,
            statut: row.livraison_statut,
          }
        : null,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error("Erreur GET Orders Postgres:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de la récupération des commandes." },
      { status: 500 }
    );
  }
}

// 2. POST: Création d'une nouvelle réservation de commande
export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const {
      userId,
      items,
      ville,
      quartier,
      deliveryLocation,
      timeSlot,
      deliveryFee,
      total,
    } = body;

    await client.query("BEGIN");

    // A. Insertion dans commandes
    const orderRes = await client.query(
      `INSERT INTO commandes (id_utilisateur, statut, montant_total)
       VALUES ($1, 'EN_ATTENTE', $2)
       RETURNING id`,
      [userId || null, total]
    );

    const orderId = orderRes.rows[0].id;

    // B. Insertion dans lignes_commande
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await client.query(
          `INSERT INTO lignes_commande (id_commande, id_produit, quantite, prix_unitaire_applique)
           VALUES ($1, $2, $3, $4)`,
          [
            orderId,
            item.productId,
            item.quantity,
            item.priceAr,
          ]
        );
      }
    }

    // C. Insertion dans livraisons
    await client.query(
      `INSERT INTO livraisons (id_commande, adresse_detaillee, ville, zone_livraison, frais_livraison, repere, statut)
       VALUES ($1, $2, $3, $4, $5, $6, 'EN_PREPARATION')`,
      [
        orderId,
        deliveryLocation || "Non spécifié",
        ville || "Antananarivo",
        quartier?.name || "Centre-ville",
        deliveryFee || 0,
        timeSlot || "",
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Erreur POST Order Postgres:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'enregistrement de la commande." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// 3. PATCH: Mise à jour du statut d'une commande (Admin)
export async function PATCH(req: Request) {
  try {
    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: "Paramètres manquants." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE commandes SET statut = $1 WHERE id = $2`,
      [newStatus, orderId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur PATCH Order Postgres:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour de la commande." },
      { status: 500 }
    );
  }
}
