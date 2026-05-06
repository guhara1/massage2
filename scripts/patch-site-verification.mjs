import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const google = "MU_vE-O28ixg9Dcxc3NG_yDEMbtaCnBohs289fRl8P8";
const naver = "d1f2064445361fe210493126bde623d9e4d9c1ad";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const tags = `<meta name="google-site-verification" content="${google}"><meta name="naver-site-verification" content="${naver}">`;

for (const file of walk(outDir).filter((path) => path.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  html = html
    .replace(/<meta name="google-site-verification" content="[^"]*"\s*\/?>(\s*)?/g, "")
    .replace(/<meta name="naver-site-verification" content="[^"]*"\s*\/?>(\s*)?/g, "");
  html = html.replace("</head>", `${tags}</head>`);
  writeFileSync(file, html, "utf8");
}
