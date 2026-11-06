import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function sanitizeFileName(name: string): string {
  const ext = path.extname(name).toLowerCase() || ".jpg";
  const base = path
    .basename(name, path.extname(name))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "image";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${base}${ext}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const folderRaw = (formData.get("folder") as string) || "products";
    const folder = folderRaw === "salon" ? "salon" : "products";

    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const allFiles: File[] = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier image fourni." },
        { status: 400 }
      );
    }

    const targetDir = path.join(process.cwd(), "public", folder);
    await mkdir(targetDir, { recursive: true });

    const savedPaths: string[] = [];

    for (const file of allFiles) {
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json(
          { error: `L'image "${file.name}" dépasse la taille maximale de 8 Mo.` },
          { status: 400 }
        );
      }

      const fileName = sanitizeFileName(file.name || "photo.jpg");
      const filePath = path.join(targetDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await writeFile(filePath, buffer);
      savedPaths.push(`/api/media/${folder}/${fileName}`);
    }

    return NextResponse.json({
      url: savedPaths[0],
      urls: savedPaths,
    });
  } catch (error: any) {
    console.error("Erreur lors de l'écriture du fichier image dans public/:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'enregistrement du fichier image." },
      { status: 500 }
    );
  }
}

