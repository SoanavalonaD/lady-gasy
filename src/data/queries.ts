import { supabase } from "./supabase";
import { Product } from "./types";

// Helper to map DB categorie_produit to UI catalog filters
function mapDbCategoryToLocal(cat: string): string {
  switch (cat) {
    case "CHEVEUX":
      return "Soins & Masques";
    case "ACCESSOIRES":
      return "Accessoires";
    case "ONGLES":
      return "Ongles";
    case "CILS":
      return "Cils";
    case "LEVRES":
      return "Lèvres";
    default:
      return "Soins & Masques";
  }
}

// 1. PRODUCTS RETRIEVAL
export async function getDbProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("produits")
    .select("*");

  if (error) {
    console.error("Error fetching products from Supabase:", error.message);
    throw error;
  }

  return (data || []).map((row: any) => ({
    id: row.id, // Supabase UUID
    name: row.nom_produit,
    description: row.description || "",
    priceAr: Number(row.prix),
    priceEur: Number(row.prix), // Direct price from database
    image: row.image_url || "/background-image.jpg",
    needs: ["Hydratation Profonde"], // Default since needs are not in SQL schema
    categories: [mapDbCategoryToLocal(row.categorie)],
    ingredients: "Ingrédients 100% naturels.",
    usage: ["Appliquer sur cheveux propres."],
    rating: 4.7,
    reviewsCount: 100
  }));
}

// 2. AUTHENTICATION: SIGN UP
export async function signUpUser(
  nom: string,
  prenom: string,
  email: string,
  telephone: string,
  password: string
) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom,
          prenom,
          telephone
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Impossible de créer l'utilisateur.");

    const userId = authData.user.id;

    // Attempt to pre-insert profile (may fail if trigger hasn't run yet, that's OK).
    // The database trigger `on_auth_user_created` will handle the final insert.
    await supabase
      .from("utilisateurs")
      .insert({
        id: userId,
        nom,
        prenom,
        email,
        telephone,
        role: "CLIENT"
      })
      .select()
      .maybeSingle(); // Ignore duplicate errors — trigger might already have inserted

    // ⚠️ Do NOT set sessionStorage here.
    // The user must confirm their email before they can log in.
    // The session will be created by Supabase only after email confirmation.
    return { success: true, emailConfirmationPending: true, user: authData.user };
  } catch (err: any) {
    console.error("Sign up failure:", err.message);
    return { success: false, error: err.message };
  }
}

// 3. AUTHENTICATION: SIGN IN
export async function signInUser(email: string, password: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Aucun utilisateur retourné.");

    const userId = authData.user.id;

    // Fetch details from utilisateurs table (maybeSingle to avoid crash if profile missing)
    const { data: userData } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    const userName = userData ? `${userData.prenom} ${userData.nom}` : email.split("@")[0];
    const userPhone = userData ? userData.telephone : "";

    // Set session storage
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userPhone", userPhone);

    return { success: true, user: authData.user };
  } catch (err: any) {
    console.error("Sign in failure:", err.message);
    return { success: false, error: err.message };
  }
}

// 4. ORDER RESERVATION
export async function createOrderReservation(orderDetails: {
  userId: string | null;
  items: Array<{ product: Product; quantity: number }>;
  fullName: string;
  phone: string;
  ville: string;
  quartier: { name: string; zone: number; fee: number };
  deliveryLocation: string;
  timeSlot: string;
  isExpress: boolean;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}) {
  // A. Insert into Table 'commandes'
  const { data: orderData, error: orderError } = await supabase
    .from("commandes")
    .insert({
      id_utilisateur: orderDetails.userId || null,
      statut: "EN_ATTENTE",
      montant_total: orderDetails.total
    })
    .select()
    .single();

  if (orderError) throw orderError;
  const orderId = orderData.id;

  // B. Insert into Table 'lignes_commande'
  const lines = orderDetails.items.map((item) => ({
    id_commande: orderId,
    id_produit: item.product.id,
    quantite: item.quantity,
    prix_unitaire_applique: item.product.priceAr
  }));

  const { error: linesError } = await supabase
    .from("lignes_commande")
    .insert(lines);

  if (linesError) throw linesError;

  // C. Insert into Table 'livraisons'
  const { error: deliveryError } = await supabase
    .from("livraisons")
    .insert({
      id_commande: orderId,
      adresse_detaillee: orderDetails.deliveryLocation,
      ville: orderDetails.ville,
      zone_livraison: orderDetails.quartier.name,
      frais_livraison: orderDetails.deliveryFee,
      repere: orderDetails.timeSlot
    });

  if (deliveryError) throw deliveryError;

  return orderId;
}

// 5. ORDER HISTORY
export async function getOrderHistory(userId: string | null): Promise<any[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("commandes")
    .select(`
      id,
      statut,
      montant_total,
      date_commande,
      lignes_commande (
        quantite,
        prix_unitaire_applique,
        id_produit
      ),
      livraisons (
        adresse_detaillee,
        ville,
        zone_livraison,
        statut
      )
    `)
    .eq("id_utilisateur", userId)
    .order("date_commande", { ascending: false });

  if (error) throw error;

  // Fetch all products to match names and images
  const dbProducts = await getDbProducts();

  // Map database order data
  return (data || []).map((order: any) => {
    const mappedItems = (order.lignes_commande || []).map((line: any) => {
      const prodMatch = dbProducts.find((p) => p.id === line.id_produit);
      return {
        nom_produit: prodMatch?.name || "Produit Lady Gasy",
        image_url: prodMatch?.image || "/background-image.jpg",
        quantite: line.quantite,
        prix_unitaire_applique: Number(line.prix_unitaire_applique)
      };
    });

    return {
      id: order.id,
      date_commande: order.date_commande,
      statut: order.statut,
      montant_total: Number(order.montant_total),
      items: mappedItems,
      livraison: order.livraisons ? {
        adresse_detaillee: order.livraisons.adresse_detaillee,
        ville: order.livraisons.ville,
        zone_livraison: order.livraisons.zone_livraison,
        statut: order.livraisons.statut
      } : null
    };
  });
}
