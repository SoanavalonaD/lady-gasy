import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ladygasy.mg";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/checkout", "/commandes"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
