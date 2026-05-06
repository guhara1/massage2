import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#050505"/>
  <rect x="6" y="6" width="52" height="52" rx="12" fill="url(#g)"/>
  <path d="M17 46V18h8l7 12 7-12h8v28h-8V31.5l-5.4 9h-3.2l-5.4-9V46h-8Z" fill="#fff"/>
  <defs>
    <linearGradient id="g" x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ff5f7e"/>
      <stop offset="1" stop-color="#ff7a1a"/>
    </linearGradient>
  </defs>
</svg>`;

writeFileSync(join(outDir, "favicon.svg"), favicon, "utf8");

const faviconTags = `<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="shortcut icon" href="/favicon.svg">`;

for (const file of walk(outDir).filter((path) => path.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  html = html.replace(/<link rel="icon"[^>]*>/g, "").replace(/<link rel="shortcut icon"[^>]*>/g, "");
  html = html.replace("</head>", `${faviconTags}</head>`);
  writeFileSync(file, html, "utf8");
}
