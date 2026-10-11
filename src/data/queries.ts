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
  const res = await fetch("/api/products", { cache: "no-store" });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error fetching products from API:", errorData);
    throw new Error(errorData.error || "Erreur lors de la récupération des produits");
  }

  const data = await res.json();

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.nom_produit,
    description: row.description || "",
    priceAr: Number(row.prix),
    priceEur: Number(row.prix),
    image: row.image_url || "/background-image.jpg",
    needs: ["Hydratation Profonde"],
    categories: [mapDbCategoryToLocal(row.categorie), row.categorie],
    rawCategory: row.categorie,
    ingredients: "Ingrédients 100% naturels.",
    usage: ["Appliquer sur cheveux propres."],
    rating: 4.7,
    reviewsCount: 100,
    stock: Number(row.stock_disponible || 0)
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
    const userRole = userData ? userData.role : "CLIENT";

    // Set session storage
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userPhone", userPhone);
    sessionStorage.setItem("userRole", userRole);

    return { success: true, user: authData.user, role: userRole };
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

  const dbProducts = await getDbProducts();

  // B. Insert into Table 'lignes_commande'
  const isUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const lines = orderDetails.items.map((item) => {
    let productId = item.product.id;

    // Fallback for legacy or invalid string product IDs
    if (!isUuid(productId)) {
      const match = dbProducts.find(
        (p) => p.name.toLowerCase() === item.product.name.toLowerCase()
      );
      if (match) {
        productId = match.id;
      }
    }

    return {
      id_commande: orderId,
      id_produit: productId,
      quantite: item.quantity,
      prix_unitaire_applique: item.product.priceAr
    };
  });

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
        id_produit: line.id_produit,
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

// 6. ADMIN FUNCTIONS

// Fetch all orders for Admin
export async function getAllAdminOrders(): Promise<any[]> {
  const { data: ordersData, error } = await supabase
    .from("commandes")
    .select(`
      id,
      id_utilisateur,
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
        frais_livraison,
        repere,
        statut
      )
    `)
    .order("date_commande", { ascending: false });

  if (error) {
    console.error("Error fetching admin orders:", error.message);
    throw error;
  }

  // Fetch users & products to hydrate order info
  const { data: usersData } = await supabase.from("utilisateurs").select("*");
  const dbProducts = await getDbProducts();

  return (ordersData || []).map((order: any) => {
    const userMatch = (usersData || []).find((u: any) => u.id === order.id_utilisateur);
    const mappedItems = (order.lignes_commande || []).map((line: any) => {
      const prodMatch = dbProducts.find((p) => p.id === line.id_produit);
      return {
        id_produit: line.id_produit,
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
      client: userMatch ? {
        nom: `${userMatch.prenom || ""} ${userMatch.nom || ""}`.trim(),
        email: userMatch.email,
        telephone: userMatch.telephone
      } : {
        nom: "Client Invité",
        email: "Non renseigné",
        telephone: "Non renseigné"
      },
      items: mappedItems,
      livraison: order.livraisons ? {
        adresse_detaillee: order.livraisons.adresse_detaillee,
        ville: order.livraisons.ville,
        zone_livraison: order.livraisons.zone_livraison,
        frais_livraison: Number(order.livraisons.frais_livraison || 0),
        repere: order.livraisons.repere,
        statut: order.livraisons.statut
      } : null
    };
  });
}

// Update Order Status in Supabase
export async function updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
  const { error } = await supabase
    .from("commandes")
    .update({ statut: newStatus })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
}

// Create Product in Supabase
export async function createAdminProduct(productData: {
  nom_produit: string;
  description: string;
  categorie: "CHEVEUX" | "ONGLES" | "ACCESSOIRES" | "CILS" | "LEVRES";
  prix: number;
  stock_disponible: number;
  image_url: string;
}): Promise<any> {
  const { data, error } = await supabase
    .from("produits")
    .insert({
      nom_produit: productData.nom_produit,
      description: productData.description,
      categorie: productData.categorie,
      prix: productData.prix,
      stock_disponible: productData.stock_disponible,
      image_url: productData.image_url
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }
  return data;
}

// Update Product in Supabase
export async function updateAdminProduct(
  id: string,
  productData: {
    nom_produit?: string;
    description?: string;
    categorie?: "CHEVEUX" | "ONGLES" | "ACCESSOIRES" | "CILS" | "LEVRES";
    prix?: number;
    stock_disponible?: number;
    image_url?: string;
  }
): Promise<any> {
  const { data, error } = await supabase
    .from("produits")
    .update(productData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error.message);
    throw error;
  }
  return data;
}

// Delete Product from Supabase
export async function deleteAdminProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("produits")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
}

// Upload Product Image to Supabase Storage Bucket ("produits")
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  const bucketName = "produits";
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Supabase Storage upload error:", uploadError);
    throw new Error(
      `Impossible d'uploader l'image dans le bucket Supabase '${bucketName}'. Détail: ${uploadError.message}`
    );
  }

  // Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}


