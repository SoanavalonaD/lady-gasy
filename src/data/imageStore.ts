import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const PRODUCT_IMAGES_FILE = path.join(process.cwd(), "src", "data", "productImages.json");
const SALON_IMAGES_FILE = path.join(process.cwd(), "src", "data", "salonImages.json");
const MAX_PHOTOS = 3;

export function normalizeSingleImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Fix known SQL typo if present
  const fixedTypo = trimmed.replace("/prj'aioducts/", "/products/");

  // Fix paths accidentally resolved under /admin/
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

  // Convert runtime-uploaded files (/products/17938... or /salon/17938...) to /api/media/...
  // because Next.js production server only serves static public/ files that existed at build time
  const runtimeUploadMatch = normalized.match(/^\/(products|salon)\/(\d{10,}-.+)$/);
  if (runtimeUploadMatch) {
    return `/api/media/${runtimeUploadMatch[1]}/${runtimeUploadMatch[2]}`;
  }

  return normalized;
}

export function parseImageArray(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      .map(normalizeSingleImageUrl)
      .filter(Boolean)
      .slice(0, MAX_PHOTOS);
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
            .map(normalizeSingleImageUrl)
            .filter(Boolean)
            .slice(0, MAX_PHOTOS);
        }
      } catch {
        // Fallback to single string
      }
    }
    const single = normalizeSingleImageUrl(trimmed);
    return single ? [single] : [];
  }
  return [];
}

async function readJsonMap(filePath: string): Promise<Record<string, string[]>> {
  try {
    const content = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(content);
    const out: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(parsed || {})) {
      const list = parseImageArray(v);
      if (list.length > 0) out[k] = list;
    }
    return out;
  } catch {
    return {};
  }
}

async function writeJsonMap(filePath: string, data: Record<string, string[]>): Promise<void> {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`Impossible d'écrire dans ${filePath}:`, err);
  }
}

export async function getStoredProductImagesMap(): Promise<Record<string, string[]>> {
  return readJsonMap(PRODUCT_IMAGES_FILE);
}

export async function saveProductImagesInCode(
  id: string,
  images: unknown
): Promise<string[]> {
  const list = parseImageArray(images);
  const map = await readJsonMap(PRODUCT_IMAGES_FILE);
  if (list.length > 0) {
    map[id] = list;
  } else {
    delete map[id];
  }
  await writeJsonMap(PRODUCT_IMAGES_FILE, map);
  return list;
}

export async function removeProductImagesFromCode(id: string): Promise<void> {
  const map = await readJsonMap(PRODUCT_IMAGES_FILE);
  if (id in map) {
    delete map[id];
    await writeJsonMap(PRODUCT_IMAGES_FILE, map);
  }
}

export async function getStoredSalonImagesMap(): Promise<Record<string, string[]>> {
  return readJsonMap(SALON_IMAGES_FILE);
}

export async function saveSalonImagesInCode(
  serviceId: string,
  images: unknown
): Promise<string[]> {
  const list = parseImageArray(images);
  const map = await readJsonMap(SALON_IMAGES_FILE);
  if (list.length > 0) {
    map[serviceId] = list;
  } else {
    delete map[serviceId];
  }
  await writeJsonMap(SALON_IMAGES_FILE, map);
  return list;
}
