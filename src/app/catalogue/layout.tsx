import { buildPageMetadata } from "@/utils/seo";

// Canonique "/catalogue" : les variantes filtrées (?cat=...) y sont rattachées.
export const metadata = buildPageMetadata({
  title: "Catalogue de soins naturels et bio",
  description:
    "Parcourez le catalogue Lady Gasy : huiles végétales, huiles essentielles, soins cheveux, visage et corps 100% naturels, livrés à Madagascar.",
  path: "/catalogue",
});

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
