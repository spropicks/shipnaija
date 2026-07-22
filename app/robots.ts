import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shipnaija.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile/edit", "/projects/new", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
