import { mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const outDir = "out";
const siteUrl = "https://massagepick.netlify.app";
const phone = "0508-202-4683";
const tel = "tel:05082024683";
const modified = new Date().toISOString();

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function toUrl(file) {
  const path = file.replace(/\\/g, "/").replace(/^out\//, "").replace(/index\.html$/, "");
  return `/${path}`.replace(/\/+/g, "/");
}

function textBetween(html, regex, fallback = "마사지허브") {
  const match = html.match(regex);
  return match ? match[1].trim().replace(/\s+/g, " ") : fallback;
}

function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function jsonScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function breadcrumbs(url) {
  const parts = url.split("/").filter(Boolean);
  const labels = ["홈", ...parts.map((part) => decodeURIComponent(part))];
  const urls = ["/", ...parts.map((_, index) => `/${parts.slice(0, index + 1).join("/")}/`)];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: labels.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${urls[index]}`,
    })),
  };
}

function headTags({ title, description, url }) {
  const canonical = `${siteUrl}${url}`;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "마사지허브",
    url: siteUrl,
    telephone: phone,
    foundingDate: "2021",
    areaServed: ["서울", "경기", "인천"],
    description: "서울, 경기, 인천 출장마사지와 홈타이 지역 정보를 행정구와 행정동 기준으로 정리하는 예약 안내 플랫폼",
    contactPoint: [{
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer support",
      availableLanguage: "ko-KR",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "11:00",
        closes: "08:00",
      },
    }],
  };
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical,
    inLanguage: "ko-KR",
    dateModified: modified,
    publisher: { "@type": "Organization", name: "마사지허브", url: siteUrl },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "마사지허브",
    url: siteUrl,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return `<link rel="canonical" href="${escapeAttr(canonical)}"><link rel="alternate" type="application/rss+xml" title="마사지허브 RSS" href="${siteUrl}/rss.xml"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"><meta property="og:locale" content="ko_KR"><meta property="og:site_name" content="마사지허브"><meta property="og:type" content="website"><meta property="og:title" content="${escapeAttr(title)}"><meta property="og:description" content="${escapeAttr(description)}"><meta property="og:url" content="${escapeAttr(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeAttr(title)}"><meta name="twitter:description" content="${escapeAttr(description)}">${jsonScript(organization)}${url === "/" ? jsonScript(website) : ""}${jsonScript(webPage)}${jsonScript(breadcrumbs(url))}`;
}

const aboutCss = `<style>:root{--bg:#050505;--panel:#111;--text:#fff;--muted:#b8b8b8;--line:#2b2b2b;--orange:#ff7a1a;--pink:#ff5f7e}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{border-bottom:1px solid var(--line);background:#050505}.top-inner{display:flex;justify-content:space-between;align-items:center;width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0}.brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:900}.brand-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--pink),var(--orange))}.nav{display:flex;gap:18px;font-size:14px}.call-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(980px,calc(100% - 32px));margin:0 auto;padding:54px 0}.eyebrow{color:var(--pink);font-weight:900}.lead{color:var(--muted);font-size:18px;line-height:1.8}h1{font-size:clamp(38px,6vw,64px);line-height:1.08}h2{color:#ff8a2a}.card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:22px;margin-top:14px}.card p,.card li{color:#d4d4d4;line-height:1.8}.footer{border-top:1px solid var(--line);margin-top:40px}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:32px 0}@media(max-width:900px){.nav{display:none}}</style>`;

function nav() {
  return `<header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">M</span>마사지허브</a><nav class="nav"><a href="/#price">요금표</a><a href="/massage-types/">마사지 종류</a><a href="/#reviews">후기</a><a href="/#faq">FAQ</a><a href="/#map">지도</a><a href="${tel}">전화예약</a></nav><a class="call-btn" href="${tel}">${phone}</a></div></header>`;
}

function simplePage({ title, description, body }) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}">${aboutCss}</head><body>${nav()}${body}<footer class="footer"><div class="footer-inner"><strong class="brand"><span class="brand-mark">M</span>마사지허브</strong><p class="lead">고객센터 ${phone} · 운영시간 오전 11시 ~ 익일 오전 8시 · 연중무휴</p></div></footer></body></html>`;
}

write("out/about/index.html", simplePage({
  title: "마사지허브 소개 | 운영 기준과 고객 안내",
  description: "마사지허브는 서울, 경기, 인천 출장마사지와 홈타이 지역 정보를 정리하는 예약 안내 플랫폼입니다. 운영 기준, 고객센터, 정보 작성 기준을 안내합니다.",
  body: `<main><section class="section"><p class="eyebrow">About MassageHub</p><h1>마사지허브 소개</h1><p class="lead">마사지허브는 2021년부터 서울, 경기, 인천 출장마사지와 홈타이 가능 지역을 행정구와 행정동 기준으로 정리해 온 예약 안내 플랫폼입니다.</p><article class="card"><h2>운영 기준</h2><p>지역별 가능 업체, 요금표, 마사지 종류, 예약 전 확인사항, 주의사항을 사용자가 빠르게 비교할 수 있도록 구성합니다. 정보는 과장된 표현보다 상담 전 실제로 확인해야 할 항목을 우선합니다.</p></article><article class="card"><h2>고객센터</h2><p>전화 상담: <a href="${tel}">${phone}</a><br>운영시간: 오전 11시 ~ 익일 오전 8시<br>운영일: 연중무휴</p></article><article class="card"><h2>작성 기준</h2><ul><li>검색 의도와 실제 예약 흐름에 맞는 정보 제공</li><li>불법 서비스 등록 및 노출 배제</li><li>지역명만 반복하는 얇은 콘텐츠 지양</li><li>예약 전 요금, 코스, 가능 시간, 주의사항 확인 강조</li></ul></article></section></main>`,
}));

write("out/safety/index.html", simplePage({
  title: "출장마사지 이용 주의사항 | 마사지허브 안전 기준",
  description: "출장마사지와 홈타이 예약 전 확인해야 할 요금, 코스, 관리 범위, 합법 운영 기준과 주의사항을 마사지허브에서 안내합니다.",
  body: `<main><section class="section"><p class="eyebrow">Safety Guide</p><h1>출장마사지 이용 주의사항</h1><p class="lead">마사지허브는 합법 웰니스 방문 관리 기준의 정보만 안내합니다. 예약 전 아래 기준을 확인해 주세요.</p><article class="card"><h2>예약 전 확인</h2><ul><li>총 금액, 코스 시간, 추가 요금 여부</li><li>방문 가능 시간과 예상 도착 시간</li><li>관리사 배정 가능 여부와 코스 범위</li><li>방문 주소, 출입 방법, 주차 가능 여부</li></ul></article><article class="card"><h2>허용하지 않는 요청</h2><p>불법 성매매, 유사 성행위, 미성년자 관련 서비스, 과도한 음주 상태의 이용, 부적절한 요청은 허용하지 않습니다. 해당 요청이 확인되면 상담 또는 방문이 중단될 수 있습니다.</p></article><article class="card"><h2>신뢰성 기준</h2><p>마사지허브는 노출 가능 여부, 스팸성 표현 배제, 검색 의도 관련성, 도움됨과 신뢰성, 페이지 경험, 내부 링크와 원본성 기준을 고려해 정보를 정리합니다.</p></article></section></main>`,
}));

for (const file of walk(outDir).filter((path) => path.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  const url = toUrl(file);
  const title = textBetween(html, /<title>(.*?)<\/title>/i);
  const description = textBetween(html, /<meta name="description" content="([^"]*)"/i, "서울, 경기, 인천 출장마사지와 홈타이 지역 안내");

  html = html
    .replace(/<link rel="canonical"[^>]*>/g, "")
    .replace(/<link rel="alternate" type="application\/rss\+xml"[^>]*>/g, "")
    .replace(/<meta name="robots"[^>]*>/g, "")
    .replace(/<meta property="og:[^"]+"[^>]*>/g, "")
    .replace(/<meta name="twitter:[^"]+"[^>]*>/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");

  html = html.replace("</head>", `${headTags({ title, description, url })}</head>`);

  if (html.includes("<footer") && !html.includes("/about/")) {
    html = html.replace("</footer>", `<nav class="footer-eeat" aria-label="운영 정보"><a href="/about/">마사지허브 소개</a><a href="/safety/">이용 주의사항</a><a href="/sitemap.xml">사이트맵</a></nav></footer>`);
    if (!html.includes(".footer-eeat{")) {
      html = html.replace("</style>", `.footer-eeat{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.footer-eeat a{border:1px solid #33261b;border-radius:999px;padding:8px 12px;color:#e8e8e8;font-size:13px;font-weight:800}</style>`);
    }
  }

  writeFileSync(file, html, "utf8");
}
