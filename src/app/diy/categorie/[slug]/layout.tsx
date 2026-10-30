import type { Metadata } from "next";
import { ADVICE_CATEGORIES } from "@/data/adviceData";
import { buildPageMetadata } from "@/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = ADVICE_CATEGORIES.find((c) => c.slug === slug);
  const path = `/diy/categorie/${slug}`;

  if (!category) {
    return buildPageMetadata({ title: "Conseils", description: "Conseils beauté naturelle Lady Gasy.", path });
  }

  return buildPageMetadata({
    title: category.name,
    description: (category.bannerSubtitle || category.description).replace(/\s+/g, " ").trim().slice(0, 160),
    path,
    image: category.image,
  });
}

export default function AdviceCategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
