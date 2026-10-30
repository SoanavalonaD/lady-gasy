import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Contactez-nous",
  description:
    "Une question sur nos produits, une commande ou le salon ? Contactez l'équipe Lady Gasy à Madagascar, nous vous répondons rapidement.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
