import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    case ".jpg":
    case ".jpeg":
    default:
      return "image/jpeg";
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ folder: string; filename: string }> }
) {
  try {
    const { folder, filename } = await context.params;
    const safeFolder = folder === "salon" ? "salon" : "products";
    const safeFilename = path.basename(decodeURIComponent(filename));

    const filePath = path.join(process.cwd(), "public", safeFolder, safeFilename);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(safeFilename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Erreur lecture image /api/media:", error?.message);
    return new NextResponse("Image introuvable", { status: 404 });
  }
}

