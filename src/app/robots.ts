import type { MetadataRoute } from "next";

const siteUrl = "https://massagepick.netlify.app";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "Googlebot", allow: "/" }, { userAgent: "Yeti", allow: "/" }, { userAgent: "NaverBot", allow: "/" }, { userAgent: "*", allow: "/" }], sitemap: `${siteUrl}/sitemap.xml` };
}
