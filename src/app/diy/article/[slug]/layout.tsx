import type { Metadata } from "next";
import { ADVICE_ARTICLES } from "@/data/adviceData";
import { buildPageMetadata } from "@/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = ADVICE_ARTICLES.find((a) => a.slug === slug);
  const path = `/diy/article/${slug}`;

  if (!article) {
    return buildPageMetadata({ title: "Article", description: "Conseils beauté naturelle Lady Gasy.", path });
  }

  return buildPageMetadata({
    title: article.title,
    description: (article.subtitle || article.intro).replace(/\s+/g, " ").trim().slice(0, 160),
    path,
    image: article.heroImage,
  });
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
