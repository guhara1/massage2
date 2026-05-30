import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const siteUrl = "https://massagepick.netlify.app";
const region = "경기";
const district = "시흥시";
const dongs = ["대야동", "신천동", "은행동", "정왕동", "배곧동", "월곶동", "목감동", "능곡동", "장곡동", "군자동", "매화동", "과림동"];

function enc(value) {
  return encodeURIComponent(value);
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

const css = `<style>:root{--bg:#050505;--panel:#111;--text:#fff;--muted:#b8b8b8;--line:#2b2b2b;--orange:#ff7a1a;--pink:#ff5f7e}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:20;background:#050505;border-bottom:1px solid var(--line)}.top-inner{display:flex;align-items:center;justify-content:space-between;width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0}.brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:900}.brand-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:var(--orange)}.nav{display:flex;gap:20px;font-size:14px}.call-btn,.primary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:48px 0}.eyebrow{color:var(--pink);font-weight:900}.lead{color:var(--muted);font-size:18px;line-height:1.75}h1{font-size:clamp(38px,6vw,68px);line-height:1.05}.card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:20px}.neighborhood-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:22px}.neighborhood-link{display:flex;align-items:center;justify-content:space-between;border:1px solid #3a2a1d;border-radius:12px;background:linear-gradient(180deg,#171717,#0f0f0f);padding:15px 16px;font-weight:900;color:#fff;min-height:56px}.neighborhood-link strong{color:var(--orange);font-size:18px}.neighborhood-link:after{content:"›";color:#ffb06b;font-size:22px}.local-shop-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.local-info{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.footer{border-top:1px solid var(--line);margin-top:40px}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:32px 0}.mobile-call{display:none}@media(max-width:900px){.nav{display:none}.neighborhood-grid,.local-shop-grid,.local-info{grid-template-columns:1fr}.mobile-call{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;align-items:center;justify-content:center;gap:10px;min-height:58px;border-radius:8px;background:var(--orange);font-weight:900}body{padding-bottom:82px}}</style>`;

function layout(title, description, body) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}">${css}</head><body><header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">M</span>마사지허브</a><nav class="nav"><a href="/#price">요금표</a><a href="/#reviews">후기</a><a href="/#faq">FAQ</a><a href="/#map">지도</a><a href="tel:05082024683">전화예약</a></nav><a class="call-btn" href="tel:05082024683">0508-202-4683</a></div></header>${body}<footer class="footer"><div class="footer-inner"><strong>마사지허브</strong><p class="lead">서울, 경기, 인천 출장마사지 지역 안내</p></div></footer><a class="mobile-call" href="tel:05082024683"><span>전화예약</span><strong>0508-202-4683</strong></a></body></html>`;
}

const districtBody = `<main><section class="section"><p class="eyebrow">경기 시흥시</p><h1>경기 시흥시 출장마사지</h1><p class="lead">시흥시 출장마사지 가능 지역을 행정동 기준으로 선택하세요. 배곧, 정왕, 은행, 신천 등 생활권별 상담 가능 시간과 요금 안내를 확인할 수 있습니다.</p><div class="neighborhood-grid">${dongs.map((dong) => `<a class="neighborhood-link" href="/area/${enc(region)}/${enc(district)}/${enc(dong)}/"><strong>${dong}</strong></a>`).join("")}</div></section></main>`;
write(`out/area/${region}/${district}/index.html`, layout("경기 시흥시 출장마사지 | 마사지허브", "경기 시흥시 출장마사지 예약 시간과 관리사 정보, 요금표, 주의사항을 확인하세요.", districtBody));

for (const dong of dongs) {
  const body = `<main><section class="section"><p class="eyebrow">경기 시흥시 ${dong}</p><h1>경기 시흥시 ${dong} 출장마사지</h1><p class="lead">${dong} 출장마사지 예약 시간, 신규 회원 할인, 관리사 스타일, 주의사항을 확인하고 전화로 바로 상담하세요.</p><a class="primary-btn" href="tel:05082024683">전화예약</a></section><section class="section"><h2>${dong} 추천 업체</h2><div class="local-shop-grid"><article class="card"><h3>${dong} 프리미엄 케어</h3><p class="lead">상담 후 가능 시간, 관리사 배정, 코스 상세, 후불 안내를 확인할 수 있습니다.</p></article><article class="card"><h3>${dong} 힐링 아로마</h3><p class="lead">시흥 생활권 이동 동선을 기준으로 예상 도착 시간과 코스 구성을 안내합니다.</p></article><article class="card"><h3>${dong} VIP 방문케어</h3><p class="lead">예약 전 요금, 코스 범위, 관리사 정보를 상담으로 확인합니다.</p></article></div></section><section class="section"><div class="local-info"><article class="card"><h2>공지사항</h2><p class="lead">예약 전 가능 시간, 코스, 추가 요금을 확인해 주세요.</p></article><article class="card"><h2>업체소개</h2><p class="lead">마사지허브는 지역별 제휴 가능 업체를 정리하는 중개형 안내 플랫폼입니다.</p></article><article class="card"><h2>관리사정보</h2><p class="lead">관리사 성별, 경력, 가능 코스는 상담으로 안내됩니다.</p></article><article class="card"><h2>주의사항</h2><p class="lead">불법 서비스는 등록과 노출을 허용하지 않습니다.</p></article></div></section></main>`;
  write(`out/area/${region}/${district}/${dong}/index.html`, layout(`경기 시흥시 ${dong} 출장마사지 | 마사지허브`, `경기 시흥시 ${dong} 출장마사지 예약 시간과 관리사 정보, 주의사항을 확인하세요.`, body));
}

if (existsSync("out/sitemap.xml")) {
  let sitemap = readFileSync("out/sitemap.xml", "utf8");
  const urls = [`<url><loc>${siteUrl}/area/${enc(region)}/${enc(district)}/</loc></url>`, ...dongs.map((dong) => `<url><loc>${siteUrl}/area/${enc(region)}/${enc(district)}/${enc(dong)}/</loc></url>`)];
  sitemap = sitemap.replace("</urlset>", `${urls.join("")}</urlset>`);
  writeFileSync("out/sitemap.xml", sitemap, "utf8");
}
