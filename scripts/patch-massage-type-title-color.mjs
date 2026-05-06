import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dir = "out/massage-types";
const titleCss = `.type-card h2{color:#ff8a2a;font-weight:900}`;

function walk(path) {
  return readdirSync(path).flatMap((name) => {
    const full = join(path, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(dir).filter((path) => path.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  if (!html.includes(titleCss)) {
    html = html.replace("</style>", `${titleCss}</style>`);
  }
  writeFileSync(file, html, "utf8");
}
