import type { MetadataRoute } from "next";
import { site } from "@/lib/regions";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "Googlebot", allow: "/" }, { userAgent: "Yeti", allow: "/" }, { userAgent: "NaverBot", allow: "/" }, { userAgent: "*", allow: "/" }], sitemap: `${site.url}/sitemap.xml` };
}
