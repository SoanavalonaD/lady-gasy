import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Conseils & Recettes DIY beauté naturelle",
  description:
    "Recettes DIY, rituels capillaires, conseils d'aromathérapie et astuces beauté au naturel : tous les guides Lady Gasy pour prendre soin de vous.",
  path: "/diy",
});

export default function DiyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
