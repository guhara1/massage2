import type { MetadataRoute } from "next";
import { getDistricts, getNeighborhoods, getPrimaryRegions, pathFor } from "@/lib/regions";

const siteUrl = "https://massagepick.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const urls = ["/", ...getPrimaryRegions().flatMap((region) => [pathFor(region), ...getDistricts(region).flatMap((district) => [pathFor(region, district), ...getNeighborhoods(region, district).map((dong) => pathFor(region, district, dong))])])];
  return urls.map((url) => ({ url: new URL(url, siteUrl).toString(), lastModified, changeFrequency: url === "/" ? "daily" : "weekly", priority: url === "/" ? 1 : 0.8 }));
}
