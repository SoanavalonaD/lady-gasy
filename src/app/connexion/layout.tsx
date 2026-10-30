import { NOINDEX_METADATA } from "@/utils/seo";

// Page privée / transactionnelle : exclue de l'index Google.
export const metadata = NOINDEX_METADATA;

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
