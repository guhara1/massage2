import { mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const outDir = "out";
const siteUrl = "https://massagepick.netlify.app";
const phone = "0508-202-4683";
const tel = "tel:05082024683";

const types = [
  {
    slug: "thai",
    name: "타이마사지",
    title: "타이마사지란? 건식 케어 특징과 예약 전 확인사항",
    description: "타이마사지의 건식 케어 특징, 적합한 이용 상황, 예약 전 확인할 점과 주의사항을 마사지허브에서 정리합니다.",
    summary: "타이마사지는 오일 사용을 최소화하거나 사용하지 않는 건식 기반 케어로 알려져 있습니다. 스트레칭, 압박, 근육 이완 중심으로 안내되는 경우가 많아 활동량이 많거나 뻐근함을 느끼는 이용자가 상담 시 자주 문의합니다.",
    goodFor: ["오일보다 산뜻한 건식 케어를 선호하는 경우", "목, 어깨, 허리처럼 뻐근한 부위 위주로 상담하고 싶은 경우", "짧은 회복감보다 전신 긴장 완화를 확인하고 싶은 경우"],
    checks: ["강도 조절 가능 여부", "90분과 120분 코스 차이", "스트레칭 포함 여부", "방문 가능 시간과 추가비 여부"],
    caution: "강한 압이 부담스럽거나 특정 부위 통증이 있다면 예약 전에 반드시 알려야 합니다. 무리한 압박보다 본인 컨디션에 맞는 강도 조절이 중요합니다."
  },
  {
    slug: "swedish",
    name: "스웨디시 마사지",
    title: "스웨디시 마사지 특징과 아로마 케어와의 차이",
    description: "스웨디시 마사지의 부드러운 오일 케어 특징, 이용 전 확인사항, 출장마사지 예약 시 주의사항을 안내합니다.",
    summary: "스웨디시 마사지는 부드러운 오일 케어와 리듬감 있는 관리 흐름을 중심으로 안내되는 경우가 많습니다. 강한 압보다 편안한 이완감을 선호하는 이용자가 상담 시 자주 비교하는 마사지 종류입니다.",
    goodFor: ["강한 압보다 부드러운 케어를 선호하는 경우", "피로감과 긴장감을 차분하게 풀고 싶은 경우", "아로마 코스와 차이를 비교해보고 싶은 경우"],
    checks: ["오일 사용 여부와 샤워 가능 환경", "관리 강도와 진행 방식", "관리사 배정 가능 시간", "추가 요금과 코스 범위"],
    caution: "스웨디시라는 명칭은 업체별로 설명 범위가 다를 수 있습니다. 예약 전 코스 범위와 합법 웰니스 기준을 정확히 확인하는 것이 좋습니다."
  },
  {
    slug: "lomi-lomi",
    name: "로미로미 마사지",
    title: "로미로미 마사지란? 부드러운 전신 케어 안내",
    description: "로미로미 마사지의 부드러운 전신 케어 특징, 적합한 이용 상황, 예약 전 확인할 점을 정리했습니다.",
    summary: "로미로미 마사지는 부드럽고 길게 이어지는 케어 흐름으로 설명되는 경우가 많습니다. 편안한 분위기와 전신 이완을 중요하게 보는 이용자에게 안내되는 마사지 종류입니다.",
    goodFor: ["부드럽고 긴 흐름의 전신 케어를 원하는 경우", "강한 압보다 안정적인 리듬을 선호하는 경우", "처음 이용이라 부담 없는 코스를 찾는 경우"],
    checks: ["로미로미 코스 실제 운영 여부", "오일 사용과 준비물", "90분 이상 코스 가능 여부", "방문 주소와 출입 안내"],
    caution: "로미로미는 업체마다 운영 방식이 다를 수 있어 명칭만 보고 예약하기보다 실제 코스 구성과 관리 범위를 먼저 확인해야 합니다."
  },
  {
    slug: "aroma",
    name: "아로마 마사지",
    title: "아로마 마사지 특징과 오일 케어 예약 가이드",
    description: "아로마 마사지의 오일 케어 특징, 코스 선택 기준, 출장마사지 예약 전 확인사항과 주의사항을 안내합니다.",
    summary: "아로마 마사지는 오일을 활용한 케어로 안내되는 대표적인 코스입니다. 부드러운 이완감, 향, 피부 마찰 부담 감소를 고려하는 이용자가 많이 비교합니다.",
    goodFor: ["건식보다 오일 케어가 편한 경우", "전신 피로와 긴장을 부드럽게 관리하고 싶은 경우", "타이마사지보다 낮은 압을 선호하는 경우"],
    checks: ["사용 오일과 알레르기 여부", "샤워 가능 환경", "코스 시간과 추가비", "관리사 배정 가능 여부"],
    caution: "피부가 민감하거나 향에 예민하다면 상담 단계에서 미리 알려야 합니다. 오일 케어 후 샤워 가능 환경도 함께 확인하는 것이 좋습니다."
  },
  {
    slug: "vip",
    name: "VIP 마사지",
    title: "VIP 마사지 코스 안내와 예약 전 확인사항",
    description: "VIP 마사지의 고급 코스 구성, 상담 시 확인할 점, 요금과 관리사 배정 기준을 마사지허브에서 안내합니다.",
    summary: "VIP 마사지는 일반 코스보다 시간, 관리 구성, 배정 조건을 더 세부적으로 확인하는 프리미엄 안내 코스입니다. 예약 전 요금과 실제 제공 범위를 명확히 확인하는 것이 중요합니다.",
    goodFor: ["긴 시간의 집중 케어를 원하는 경우", "관리사 배정 조건을 세부적으로 확인하고 싶은 경우", "일반 코스보다 프리미엄 구성을 비교하고 싶은 경우"],
    checks: ["VIP 코스 포함 범위", "요금과 추가비", "관리사 배정 조건", "예약 가능 시간과 취소 기준"],
    caution: "VIP라는 표현은 업체별 기준 차이가 큽니다. 과장된 안내보다 실제 코스 시간, 요금, 관리 범위, 합법 운영 기준을 우선 확인해야 합니다."
  },
  {
    slug: "sureol",
    name: "슈얼마사지",
    title: "슈얼마사지 명칭과 예약 전 확인해야 할 기준",
    description: "슈얼마사지 명칭을 사용하는 코스의 확인사항, 합법 웰니스 기준, 예약 전 주의할 점을 정리합니다.",
    summary: "슈얼마사지는 업체마다 명칭과 설명이 다르게 쓰일 수 있는 코스입니다. 따라서 이름만 보고 판단하기보다 실제 관리 범위, 요금, 운영 기준, 주의사항을 상담에서 확인해야 합니다.",
    goodFor: ["코스 명칭과 실제 제공 범위를 먼저 비교하고 싶은 경우", "일반 아로마 또는 스웨디시와 차이를 상담으로 확인하고 싶은 경우", "합법 웰니스 기준의 방문 케어만 이용하려는 경우"],
    checks: ["코스 명칭의 실제 의미", "합법 운영 기준", "요금과 시간", "부적절한 요청 차단 기준"],
    caution: "부적절한 요청이나 불법 서비스는 허용하지 않습니다. 슈얼마사지라는 이름을 보더라도 반드시 합법 웰니스 방문 관리 기준으로만 상담해야 합니다."
  }
];

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

const css = `<style>:root{--bg:#050505;--panel:#111;--text:#fff;--muted:#b8b8b8;--line:#2b2b2b;--orange:#ff7a1a;--pink:#ff5f7e}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:20;background:#050505;border-bottom:1px solid var(--line)}.top-inner{display:flex;align-items:center;justify-content:space-between;width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0}.brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:900}.brand-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--pink),var(--orange))}.nav{display:flex;gap:18px;font-size:14px}.call-btn,.primary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:48px 0}.eyebrow{color:var(--pink);font-weight:900;margin:0 0 12px}h1{font-size:clamp(38px,6vw,68px);line-height:1.05;margin:0}h2{font-size:32px;margin:0 0 18px}.lead{color:var(--muted);font-size:18px;line-height:1.75}.type-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.type-card,.info-card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:22px}.type-card h2{font-size:24px}.type-card p,.info-card p,.info-card li{color:#cfcfcf;line-height:1.75}.type-card span{color:#ff8a2a;font-weight:900}.info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.info-card ul{margin:12px 0 0;padding-left:18px}.notice-band{border:1px solid #33261b;border-radius:14px;background:linear-gradient(180deg,#15120f,#101010);padding:22px}.footer{border-top:1px solid var(--line);margin-top:40px}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:32px 0}.mobile-call{display:none}@media(max-width:900px){.nav{display:none}.type-grid,.info-grid{grid-template-columns:1fr}.mobile-call{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;align-items:center;justify-content:center;gap:10px;min-height:58px;border-radius:8px;background:var(--orange);font-weight:900}body{padding-bottom:82px}}</style>`;

function nav() {
  return `<header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">M</span>마사지허브</a><nav class="nav"><a href="/#price">요금표</a><a href="/massage-types/">마사지 종류</a><a href="/#reviews">후기</a><a href="/#faq">FAQ</a><a href="/#map">지도</a><a href="${tel}">전화예약</a></nav><a class="call-btn" href="${tel}">${phone}</a></div></header>`;
}

function layout(title, description, body) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}">${css}</head><body>${nav()}${body}<footer class="footer"><div class="footer-inner"><strong class="brand"><span class="brand-mark">M</span>마사지허브</strong><p class="lead">서울, 경기, 인천 출장마사지 홈타이 지역 안내</p></div></footer><a class="mobile-call" href="${tel}"><span>전화예약</span><strong>${phone}</strong></a></body></html>`;
}

const hubBody = `<main><section class="section"><p class="eyebrow">마사지 코스 이해하기</p><h1>마사지 종류 안내</h1><p class="lead">타이마사지, 스웨디시 마사지, 로미로미 마사지, 아로마 마사지, VIP 마사지, 슈얼마사지의 차이를 예약 전 확인할 수 있도록 정리했습니다. 마사지허브는 노출 가능 여부, 스팸성 표현 배제, 검색 의도 관련성, 도움됨과 신뢰성, 페이지 경험, 원본성 기준을 고려해 코스 정보를 안내합니다.</p></section><section class="section"><div class="type-grid">${types.map((type) => `<a class="type-card" href="/massage-types/${type.slug}/"><span>코스 안내</span><h2>${type.name}</h2><p>${type.summary}</p></a>`).join("")}</div></section><section class="section"><div class="notice-band"><h2>예약 전 공통 확인 기준</h2><p class="lead">마사지 종류명은 업체마다 설명 범위가 다를 수 있습니다. 이름만 보고 판단하기보다 실제 코스 시간, 요금, 관리 범위, 관리사 배정 가능 여부, 합법 웰니스 운영 기준을 상담 단계에서 확인하는 것이 좋습니다.</p></div></section></main>`;
write("out/massage-types/index.html", layout("마사지 종류 안내 | 타이마사지 스웨디시 로미로미 아로마 VIP 슈얼마사지", "마사지허브에서 타이마사지, 스웨디시 마사지, 로미로미 마사지, 아로마 마사지, VIP 마사지, 슈얼마사지 종류와 예약 전 확인사항을 안내합니다.", hubBody));

for (const type of types) {
  const body = `<main><section class="section"><p class="eyebrow">마사지 종류</p><h1>${type.name}</h1><p class="lead">${type.summary}</p><a class="primary-btn" href="${tel}">전화 상담</a></section><section class="section"><div class="info-grid"><article class="info-card"><h2>이런 경우에 비교해보세요</h2><ul>${type.goodFor.map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="info-card"><h2>예약 전 확인사항</h2><ul>${type.checks.map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="info-card"><h2>주의사항</h2><p>${type.caution}</p></article><article class="info-card"><h2>마사지허브 안내 기준</h2><p>마사지허브는 과장된 표현보다 실제 예약 전 필요한 정보를 우선합니다. 노출 가능 여부, 스팸성 표현 배제, 검색 의도 관련성, 도움됨과 신뢰성, 페이지 경험, 내부 링크와 원본성 기준을 고려해 코스 정보를 정리합니다.</p></article></div></section><section class="section"><div class="notice-band"><h2>${type.name} FAQ</h2><p class="lead">요금은 지역, 시간대, 코스 구성, 업체 배정 상황에 따라 달라질 수 있습니다. 예약 전 총 금액, 코스 시간, 관리 범위, 방문 가능 시간을 전화로 다시 확인하세요.</p></div></section></main>`;
  write(`out/massage-types/${type.slug}/index.html`, layout(`${type.name} 안내 | 마사지허브`, `${type.name} 특징, 적합한 이용 상황, 예약 전 확인사항과 주의사항을 마사지허브에서 안내합니다.`, body));
}

for (const file of walk(outDir).filter((path) => path.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  html = html.replace(/<nav class="nav">[\s\S]*?<\/nav>/g, `<nav class="nav"><a href="/#price">요금표</a><a href="/massage-types/">마사지 종류</a><a href="/#reviews">후기</a><a href="/#faq">FAQ</a><a href="/#map">지도</a><a href="${tel}">전화예약</a></nav>`);
  writeFileSync(file, html, "utf8");
}

if (existsSync("out/sitemap.xml")) {
  let sitemap = readFileSync("out/sitemap.xml", "utf8");
  const urls = [`/massage-types/`, ...types.map((type) => `/massage-types/${type.slug}/`)];
  sitemap = sitemap.replace("</urlset>", `${urls.map((url) => `<url><loc>${siteUrl}${url}</loc></url>`).join("")}</urlset>`);
  writeFileSync("out/sitemap.xml", sitemap, "utf8");
}
