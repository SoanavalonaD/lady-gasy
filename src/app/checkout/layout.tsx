import { NOINDEX_METADATA } from "@/utils/seo";

// Page privée / transactionnelle : exclue de l'index Google.
export const metadata = NOINDEX_METADATA;

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
