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

export const MAX_PRODUCT_PHOTOS = 3;
const PRODUCT_IMAGES_STORAGE_KEY = "ladygasy_product_images_v2";

export function normalizeImageUrl(url: string): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";

  const fixedTypo = trimmed.replace("/prj'aioducts/", "/products/");

  let normalized = fixedTypo;
  if (normalized.startsWith("/admin/products/")) {
    normalized = normalized.replace(/^\/admin\/products\//, "/products/");
  } else if (normalized.startsWith("/admin/salon/")) {
    normalized = normalized.replace(/^\/admin\/salon\//, "/salon/");
  } else if (
    !normalized.startsWith("/") &&
    !normalized.startsWith("http://") &&
    !normalized.startsWith("https://") &&
    !normalized.startsWith("data:") &&
    !normalized.startsWith("blob:")
  ) {
    normalized = `/${normalized}`;
  }

  const runtimeUploadMatch = normalized.match(/^\/(products|salon)\/(\d{10,}-.+)$/);
  if (runtimeUploadMatch) {
    return `/api/media/${runtimeUploadMatch[1]}/${runtimeUploadMatch[2]}`;
  }

  return normalized;
}

export function parseProductImages(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      .map(normalizeImageUrl)
      .filter(Boolean)
      .slice(0, MAX_PRODUCT_PHOTOS);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
            .map(normalizeImageUrl)
            .filter(Boolean)
            .slice(0, MAX_PRODUCT_PHOTOS);
        }
      } catch {
        // Fallback to single string if JSON parsing fails
      }
    }
    const normalized = normalizeImageUrl(trimmed);
    return normalized ? [normalized] : [];
  }
  return [];
}

export function serializeProductImages(images: string[] | string): string {
  const list = parseProductImages(images);
  if (list.length === 0) return "/background-image.jpg";
  if (list.length === 1) return list[0];
  return JSON.stringify(list);
}

function getLocalProductImages(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRODUCT_IMAGES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(parsed || {})) {
      const list = parseProductImages(v);
      if (list.length > 0) out[k] = list;
    }
    return out;
  } catch {
    return {};
  }
}

function setLocalProductImages(map: Record<string, string[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCT_IMAGES_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore quota errors
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
  const localImagesMap = getLocalProductImages();

  return (data || []).map((row: any) => {
    const fromServer = parseProductImages(row.images || row.image_url);
    const fromLocal = localImagesMap[row.id];
    const parsedImages =
      fromServer.length > 1
        ? fromServer
        : fromLocal && fromLocal.length > 0
          ? fromLocal
          : fromServer;
    const primaryImage = parsedImages[0] || "/background-image.jpg";
    return {
      id: row.id,
      name: row.nom_produit,
      description: row.description || "",
      priceAr: Number(row.prix),
      priceEur: Number(row.prix),
      image: primaryImage,
      images: parsedImages.length > 0 ? parsedImages : [primaryImage],
      needs: ["Hydratation Profonde"],
      categories: [mapDbCategoryToLocal(row.categorie), row.categorie],
      rawCategory: row.categorie,
      ingredients: "Ingrédients 100% naturels.",
      usage: ["Appliquer sur cheveux propres."],
      rating: 4.7,
      reviewsCount: 100,
      stock: Number(row.stock_disponible || 0),
    };
  });
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

// Create Product in Postgres + Code JSON
export async function createAdminProduct(productData: {
  nom_produit: string;
  description: string;
  categorie: ProductCategory;
  prix: number;
  stock_disponible: number;
  image_url: string;
  images?: string[];
}): Promise<any> {
  const normalizedList = parseProductImages(
    productData.images !== undefined ? productData.images : productData.image_url
  );
  const serialized = serializeProductImages(normalizedList);

  const res = await fetch("/api/products/manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...productData,
      image_url: serialized,
      images: normalizedList,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la création du produit.");
  }

  if (data?.id && normalizedList.length > 0) {
    const localMap = getLocalProductImages();
    localMap[data.id] = normalizedList;
    setLocalProductImages(localMap);
  }

  return data;
}

// Update Product in Postgres + Code JSON
export async function updateAdminProduct(
  id: string,
  productData: {
    nom_produit?: string;
    description?: string;
    categorie?: ProductCategory;
    prix?: number;
    stock_disponible?: number;
    image_url?: string;
    images?: string[];
  }
): Promise<any> {
  const rawImg =
    productData.images !== undefined ? productData.images : productData.image_url;
  const normalizedList = rawImg !== undefined ? parseProductImages(rawImg) : undefined;
  const serialized =
    normalizedList !== undefined ? serializeProductImages(normalizedList) : undefined;

  if (id && normalizedList) {
    const localMap = getLocalProductImages();
    localMap[id] = normalizedList;
    setLocalProductImages(localMap);
  }

  const res = await fetch("/api/products/manage", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      ...productData,
      image_url: serialized,
      images: normalizedList,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de la modification du produit.");
  }

  return data;
}

// Delete Product from Postgres
export async function deleteAdminProduct(id: string): Promise<void> {
  const localMap = getLocalProductImages();
  if (id in localMap) {
    delete localMap[id];
    setLocalProductImages(localMap);
  }

  const res = await fetch(`/api/products/manage?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erreur lors de la suppression du produit.");
  }
}

async function uploadFilesToPublicFolder(
  files: FileList | File[],
  folder: "products" | "salon",
  maxCount: number
): Promise<string[]> {
  const arr = Array.from(files).slice(0, maxCount);
  if (arr.length === 0) return [];

  for (const file of arr) {
    if (file.size > 8 * 1024 * 1024) {
      throw new Error(`L'image "${file.name}" est trop volumineuse (max 8 Mo).`);
    }
  }

  try {
    const formData = new FormData();
    formData.append("folder", folder);
    for (const file of arr) {
      formData.append("files", file);
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.urls) && data.urls.length > 0) {
        return data.urls.map(normalizeImageUrl);
      }
      if (typeof data.url === "string") {
        return [normalizeImageUrl(data.url)];
      }
    }
  } catch (err) {
    console.warn("Fallback lecture locale de l'image:", err);
  }

  // Fallback si l'API /api/upload n'est pas joignable
  return Promise.all(
    arr.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            typeof reader.result === "string"
              ? resolve(reader.result)
              : reject(new Error("Échec de la lecture de l'image."));
          reader.onerror = () =>
            reject(new Error("Erreur lors de la lecture du fichier image."));
          reader.readAsDataURL(file);
        })
    )
  );
}

// Upload d'une seule image produit dans public/products/
export async function uploadProductImage(file: File): Promise<string> {
  const urls = await uploadFilesToPublicFolder([file], "products", 1);
  return urls[0];
}

// 7. SALON SERVICES IMAGES MANAGEMENT (jusqu'à 3 photos par prestation)

export const MAX_SALON_PHOTOS = 3;
const SALON_IMAGES_STORAGE_KEY = "ladygasy_salon_service_images_v2";

function normalizeImageList(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      .map(normalizeImageUrl)
      .filter(Boolean)
      .slice(0, MAX_SALON_PHOTOS);
  }
  if (typeof val === "string" && val.trim().length > 0) {
    const normalized = normalizeImageUrl(val.trim());
    return normalized ? [normalized] : [];
  }
  return [];
}

function getLocalSalonImages(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw =
      localStorage.getItem(SALON_IMAGES_STORAGE_KEY) ||
      localStorage.getItem("ladygasy_salon_service_images");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const list = normalizeImageList(v);
      if (list.length > 0) out[k] = list;
    }
    return out;
  } catch {
    return {};
  }
}

function setLocalSalonImages(map: Record<string, string[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SALON_IMAGES_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

export async function getSalonServiceImages(): Promise<Record<string, string[]>> {
  const localMap = getLocalSalonImages();
  try {
    const res = await fetch("/api/salon/services", { cache: "no-store" });
    if (!res.ok) {
      return localMap;
    }
    const rawDbMap: Record<string, unknown> = await res.json();
    const dbMap: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(rawDbMap)) {
      const list = normalizeImageList(v);
      if (list.length > 0) dbMap[k] = list;
    }
    const merged = { ...localMap, ...dbMap };
    setLocalSalonImages(merged);
    return merged;
  } catch (err) {
    console.error("Error fetching salon service images:", err);
    return localMap;
  }
}

export async function updateSalonServiceImages(
  serviceId: string,
  images: string[]
): Promise<string[]> {
  const cleaned = normalizeImageList(images);
  const localMap = getLocalSalonImages();
  if (cleaned.length > 0) {
    localMap[serviceId] = cleaned;
  } else {
    delete localMap[serviceId];
  }
  setLocalSalonImages(localMap);

  const res = await fetch("/api/salon/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: serviceId, images: cleaned }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.warn("Saved salon images locally; DB warning:", data.error);
  }

  return cleaned;
}

export async function deleteSalonServiceImage(
  serviceId: string,
  index?: number
): Promise<string[]> {
  const localMap = getLocalSalonImages();
  const current = localMap[serviceId] || [];

  if (index !== undefined) {
    const next = current.filter((_, i) => i !== index);
    return updateSalonServiceImages(serviceId, next);
  }

  delete localMap[serviceId];
  setLocalSalonImages(localMap);

  const res = await fetch(
    `/api/salon/services?id=${encodeURIComponent(serviceId)}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.warn("Deleted salon images locally; DB warning:", data.error);
  }

  return [];
}

export async function uploadSalonServiceImage(file: File): Promise<string> {
  const urls = await uploadFilesToPublicFolder([file], "salon", 1);
  return urls[0];
}

export async function uploadProductImages(
  files: FileList | File[]
): Promise<string[]> {
  return uploadFilesToPublicFolder(files, "products", MAX_PRODUCT_PHOTOS);
}

export async function uploadSalonServiceImages(
  files: FileList | File[]
): Promise<string[]> {
  return uploadFilesToPublicFolder(files, "salon", MAX_SALON_PHOTOS);
}

