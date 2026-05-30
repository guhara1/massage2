import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const siteUrl = "https://massagepick.netlify.app";
const today = new Date().toISOString().slice(0, 10);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function toUrl(file) {
  const path = file.replace(/\\/g, "/").replace(/^out\//, "").replace(/index\.html$/, "");
  return `/${path}`.replace(/\/+/g, "/");
}

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pageTitle(file) {
  const html = readFileSync(file, "utf8");
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? match[1].trim() : "마사지허브";
}

function pageDescription(file) {
  const html = readFileSync(file, "utf8");
  const match = html.match(/<meta name="description" content="([^"]*)"/i);
  return match ? match[1].trim() : "서울, 경기, 인천 출장마사지 지역 안내";
}

const htmlPages = walk(outDir)
  .filter((file) => file.endsWith(".html"))
  .map((file) => ({ file, url: toUrl(file) }))
  .filter(({ url }) => !url.includes("404"))
  .sort((a, b) => a.url.localeCompare(b.url, "ko"));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${htmlPages.map(({ url }) => `  <url><loc>${siteUrl}${escapeXml(url)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${url === "/" ? "1.0" : url.split("/").filter(Boolean).length <= 2 ? "0.8" : "0.6"}</priority></url>`).join("\n")}
</urlset>
`;

writeFileSync(join(outDir, "sitemap.xml"), sitemap, "utf8");

const rssPages = htmlPages
  .filter(({ url }) => url === "/" || url.startsWith("/massage-types/") || url.split("/").filter(Boolean).length <= 3)
  .slice(0, 80);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>마사지허브</title>
    <link>${siteUrl}/</link>
    <description>서울, 경기, 인천 출장마사지 지역 및 마사지 종류 안내</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssPages.map(({ file, url }) => `    <item><title>${escapeXml(pageTitle(file))}</title><link>${siteUrl}${escapeXml(url)}</link><guid>${siteUrl}${escapeXml(url)}</guid><description>${escapeXml(pageDescription(file))}</description><pubDate>${new Date().toUTCString()}</pubDate></item>`).join("\n")}
  </channel>
</rss>
`;

writeFileSync(join(outDir, "rss.xml"), rss, "utf8");

const robots = `User-agent: Googlebot
Allow: /

User-agent: NaverBot
Allow: /

User-agent: Yeti
Allow: /

User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(join(outDir, "robots.txt"), robots, "utf8");
