import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Salon de beauté et soins capillaires",
  description:
    "Le salon Lady Gasy : soins capillaires experts, rituels de beauté naturels et moments de bien-être. Découvrez nos prestations et réservez.",
  path: "/salon",
});

export default function SalonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
