import type { Metadata } from "next";

export const SITE_URL = "https://ladygasy.mg";
export const SITE_NAME = "Lady Gasy";
const DEFAULT_IMAGE = "/background-image.jpg";

interface PageSeo {
  title: string;
  description: string;
  /** Chemin canonique de la page, ex. "/catalogue" */
  path: string;
  image?: string;
}

/**
 * Construit les métadonnées SEO d'une page publique :
 * titre, description, URL canonique, Open Graph et Twitter propres à la page.
 */
export function buildPageMetadata({ title, description, path, image }: PageSeo): Metadata {
  const ogImage = image || DEFAULT_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "fr_MG",
      type: "website",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

/** Métadonnées pour les pages privées / transactionnelles à exclure de l'index. */
export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: true },
};
