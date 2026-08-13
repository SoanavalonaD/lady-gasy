import { supabase } from "./supabase";
import { products, Product } from "./products";

// 1. PRODUCTS RETRIEVAL WITH LOCAL FALLBACK
export async function getDbProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("produits")
      .select("*");

    if (error) {
      console.warn("Supabase fetch failed, falling back to local dataset:", error.message);
      return products;
    }

    if (!data || data.length === 0) {
      console.log("Supabase produits table is empty, falling back to local dataset.");
      return products;
    }

    // Map database rows to local Product interface
    return data.map((row: any) => {
      // Find matching local product to enrich details like ingredients and usage
      const localMatch = products.find(
        (p) => p.name.toLowerCase() === row.nom_produit.toLowerCase()
      );

      return {
        id: row.id, // Supabase UUID
        name: row.nom_produit,
        description: row.description || "",
        priceAr: Number(row.prix),
        priceEur: Number(row.prix) / 4500, // Conversion estimate
        image: row.image_url || "/background-image.jpg",
        needs: localMatch?.needs || ["Soin Capillaire"],
        categories: [row.categorie],
        ingredients: localMatch?.ingredients || "Ingrédients 100% naturels.",
        usage: localMatch?.usage || ["Appliquer sur cheveux propres."],
        rating: localMatch?.rating || 4.7,
        reviewsCount: localMatch?.reviewsCount || 105
      };
    });
  } catch (err) {
    console.error("Critical error in getDbProducts, falling back:", err);
    return products;
  }
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
    // A. Sign up user in Supabase Auth
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

    // B. Save to users table (utilisateurs)
    const { error: insertError } = await supabase
      .from("utilisateurs")
      .insert({
        id: userId,
        nom,
        prenom,
        email,
        telephone,
        role: "CLIENT"
      });

    if (insertError) {
      console.warn("Could not write to utilisateurs table (RLS/Permissions), saving locally:", insertError.message);
    }

    // C. Set session storage
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("userName", `${prenom} ${nom}`);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userPhone", telephone);

    return { success: true, user: authData.user };
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

    // Fetch details from utilisateurs table
    const { data: userData, error: userError } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", userId)
      .single();

    let userName = email.split("@")[0];
    let userPhone = "";

    if (userError) {
      console.warn("Could not read from utilisateurs table, using auth metadata:", userError.message);
      const metadata = authData.user.user_metadata || {};
      userName = metadata.prenom && metadata.nom ? `${metadata.prenom} ${metadata.nom}` : userName;
      userPhone = metadata.telephone || "";
    } else if (userData) {
      userName = `${userData.prenom} ${userData.nom}`;
      userPhone = userData.telephone;
    }

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
  const localOrderKey = "local_orders_history";

  // Always back up order details locally in localStorage for robust history tracking
  const backupOrder = {
    id: crypto.randomUUID(),
    date_commande: new Date().toISOString(),
    statut: "EN_ATTENTE",
    montant_total: orderDetails.total,
    items: orderDetails.items.map(item => ({
      nom_produit: item.product.name,
      image_url: item.product.image,
      quantite: item.quantity,
      prix_unitaire_applique: item.product.priceAr
    })),
    livraison: {
      adresse_detaillee: orderDetails.deliveryLocation,
      ville: orderDetails.ville,
      zone_livraison: orderDetails.quartier.name,
      statut: "EN_PREPARATION"
    }
  };

  try {
    const localHistory = localStorage.getItem(localOrderKey);
    const parsedHistory = localHistory ? JSON.parse(localHistory) : [];
    parsedHistory.unshift(backupOrder);
    localStorage.setItem(localOrderKey, JSON.stringify(parsedHistory));
  } catch (e) {
    console.warn("Could not save order backup in localStorage:", e);
  }

  // Attempt to write to Supabase
  try {
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
    const lines = orderDetails.items.map((item) => {
      // If the product ID is a UUID (from Supabase), use it. Otherwise, use a default fallback UUID.
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.product.id);
      
      return {
        id_commande: orderId,
        id_produit: isValidUUID ? item.product.id : "00000000-0000-0000-0000-000000000000", // Fallback for local products
        quantite: item.quantity,
        prix_unitaire_applique: item.product.priceAr
      };
    });

    const { error: linesError } = await supabase
      .from("lignes_commande")
      .insert(lines);

    if (linesError) console.error("Error inserting lignes_commande:", linesError.message);

    // C. Insert into Table 'livraisons'
    const { error: deliveryError } = await supabase
      .from("livraisons")
      .insert({
        id_commande: orderId,
        adresse_detaillee: orderDetails.deliveryLocation,
        ville: orderDetails.ville,
        zone_livraison: orderDetails.quartier.name,
        frais_livraison: orderDetails.deliveryFee,
        repere: orderDetails.timeSlot // Save timeSlot inside repere or notes
      });

    if (deliveryError) console.error("Error inserting livraisons:", deliveryError.message);

    return { success: true, orderId };
  } catch (err: any) {
    console.warn("Could not save reservation in Supabase database (RLS restricted), saved locally:", err.message);
    return { success: true, orderId: backupOrder.id, localOnly: true };
  }
}

// 5. ORDER HISTORY
export async function getOrderHistory(userId: string | null): Promise<any[]> {
  const localOrderKey = "local_orders_history";
  
  // Load local backups first
  let localOrders: any[] = [];
  try {
    const localData = localStorage.getItem(localOrderKey);
    if (localData) {
      localOrders = JSON.parse(localData);
    }
  } catch (e) {
    console.error("Failed to parse local orders:", e);
  }

  if (!userId) return localOrders;

  // Try to load from Supabase
  try {
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
    if (!data || data.length === 0) return localOrders;

    // Fetch all products to match names and images
    const dbProducts = await getDbProducts();

    // Map database order data
    const dbOrders = data.map((order: any) => {
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

    // Merge database orders and local orders to ensure completeness, filter duplicates by ID
    const merged = [...dbOrders];
    localOrders.forEach(local => {
      if (!merged.some(db => db.id === local.id)) {
        merged.push(local);
      }
    });

    // Sort by date descending
    return merged.sort((a, b) => new Date(b.date_commande).getTime() - new Date(a.date_commande).getTime());
  } catch (err: any) {
    console.warn("Could not fetch order history from Supabase (RLS restricted), showing local cache:", err.message);
    return localOrders;
  }
}
