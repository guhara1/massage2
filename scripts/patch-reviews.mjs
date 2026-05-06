import { existsSync, readFileSync, writeFileSync } from "node:fs";

const files = ["out/index.html", "out/reviews/index.html"];
const sliderCss = `<style>
.review-grid{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:calc((100% - 14px)/2)!important;grid-template-columns:none!important;gap:14px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;padding:4px 2px 18px!important;scrollbar-width:thin!important;scrollbar-color:var(--orange) #1a1a1a!important}
.review-grid::-webkit-scrollbar{height:9px}.review-grid::-webkit-scrollbar-track{background:#1a1a1a;border-radius:999px}.review-grid::-webkit-scrollbar-thumb{background:var(--orange);border-radius:999px}.review-card{scroll-snap-align:start!important;min-height:220px!important}.review-foot{display:block!important;margin-top:16px!important}.review-foot a{display:none!important}@media(max-width:760px){.review-grid{grid-auto-columns:86%!important}.review-card{min-height:auto!important}}
</style>`;

for (const file of files) {
  if (!existsSync(file)) continue;
  let html = readFileSync(file, "utf8");
  html = html.replace(/<div class="review-foot"><strong>([^<]+)<\/strong><a href="tel:05082024683">전화예약<\/a><\/div>/g, '<div class="review-foot"><strong>$1</strong></div>');
  if (!html.includes("grid-auto-columns:calc((100% - 14px)/2)")) {
    html = html.replace("</head>", `${sliderCss}</head>`);
  }
  writeFileSync(file, html, "utf8");
}
