import { Product } from "./types";

// Helper to map DB categorie_produit to UI catalog filters
function mapDbCategoryToLocal(cat: string): string {
  switch (cat) {
    case "VISAGE":
      return "Visage";
    case "CHEVEUX":
      return "Cheveux";
    case "CORPS":
      return "Corps";
    case "HUILES_ESSENTIELLES":
      return "Huiles essentielles";
    case "ACCESSOIRES":
      return "Accessoires";
    case "ONGLES":
      return "Ongles";
    case "CILS":
      return "Cils";
    case "LEVRES":
      return "Lèvres";
    default:
      return "Cheveux";
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
    stock: Number(row.stock_disponible || 0),
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
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, telephone, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Échec de l'inscription.");
    }

    const user = data.user;
    const userName = `${user.prenom || ""} ${user.nom || ""}`.trim() || user.email;
    const userRole = user.role || "CLIENT";

    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", user.id);
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("userPhone", user.telephone || "");
    sessionStorage.setItem("userRole", userRole);

    return {
      success: true,
      emailConfirmationPending: false,
      user,
      role: userRole,
    };
  } catch (err: any) {
    console.error("Sign up failure:", err.message);
    return { success: false, error: err.message };
  }
}

// 3. AUTHENTICATION: SIGN IN
export async function signInUser(email: string, password: string) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Échec de la connexion.");
    }

    const user = data.user;
    const userName = `${user.prenom || ""} ${user.nom || ""}`.trim() || user.email;
    const userRole = user.role || "CLIENT";

    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", user.id);
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("userPhone", user.telephone || "");
    sessionStorage.setItem("userRole", userRole);

    return { success: true, user, role: userRole };
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
  const dbProducts = await getDbProducts();

  const formattedItems = orderDetails.items.map((item) => {
    let prodId = item.product.id;
    // Fallback si l'ID n'est pas un UUID valide
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(prodId);
    if (!isUuid) {
      const match = dbProducts.find((p) => p.name.toLowerCase() === item.product.name.toLowerCase());
      if (match) prodId = match.id;
    }

    return {
      productId: prodId,
      quantity: item.quantity,
      priceAr: item.product.priceAr,
    };
  });

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: orderDetails.userId,
      items: formattedItems,
      ville: orderDetails.ville,
      quartier: orderDetails.quartier,
      deliveryLocation: orderDetails.deliveryLocation,
      timeSlot: orderDetails.timeSlot,
      deliveryFee: orderDetails.deliveryFee,
      total: orderDetails.total,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la réservation de commande.");
  }

  return data.orderId;
}

// 5. ORDER HISTORY
export async function getOrderHistory(userId: string | null): Promise<any[]> {
  if (!userId) return [];

  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error fetching order history");
    return [];
  }

  return await res.json();
}

// 6. ADMIN FUNCTIONS

// Fetch all orders for Admin
export async function getAllAdminOrders(): Promise<any[]> {
  const res = await fetch(`/api/orders?admin=true`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error fetching admin orders");
    return [];
  }

  return await res.json();
}

// Update Order Status in Postgres
export async function updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
  const res = await fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, newStatus }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Erreur lors de la mise à jour du statut.");
  }
}

export type ProductCategory =
  | "VISAGE"
  | "CHEVEUX"
  | "CORPS"
  | "HUILES_ESSENTIELLES"
  | "ACCESSOIRES"
  | "ONGLES"
  | "CILS"
  | "LEVRES";

// Create Product in Postgres
export async function createAdminProduct(productData: {
  nom_produit: string;
  description: string;
  categorie: ProductCategory;
  prix: number;
  stock_disponible: number;
  image_url: string;
}): Promise<any> {
  const res = await fetch("/api/products/manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la création du produit.");
  }

  return data;
}

// Update Product in Postgres
export async function updateAdminProduct(
  id: string,
  productData: {
    nom_produit?: string;
    description?: string;
    categorie?: ProductCategory;
    prix?: number;
    stock_disponible?: number;
    image_url?: string;
  }
): Promise<any> {
  const res = await fetch("/api/products/manage", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...productData }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la modification du produit.");
  }

  return data;
}

// Delete Product from Postgres
export async function deleteAdminProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/manage?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erreur lors de la suppression du produit.");
  }
}

// Upload Product Image (Fallback / local public)
export async function uploadProductImage(file: File): Promise<string> {
  // Par défaut, nous retournons une image standard ou le nom du fichier
  return `/products/${file.name}`;
}
