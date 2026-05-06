import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "out/area";
const detailCss = `<style>
.course-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.course-card{border:1px solid #33261b;border-radius:14px;background:#151313;padding:18px}.course-card h3{margin:0 0 16px;color:#ff7a1a}.course-row{display:flex;justify-content:space-between;border-bottom:1px dashed #333;padding:10px 0}.square-shop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.square-shop{aspect-ratio:1/1;border:1px solid #2b2b2b;border-radius:14px;background:linear-gradient(180deg,#151515,#0d0d0d);padding:18px;display:flex;flex-direction:column;justify-content:space-between}.square-shop h3{margin:0;font-size:20px;line-height:1.35}.square-shop p{margin:0;color:#b8b8b8;line-height:1.55}.square-shop .tagline{color:#ffb06b;font-size:13px;font-weight:900}.local-info .card p{font-size:17px}.local-info ul{margin:14px 0 0;padding-left:18px;color:#b8b8b8;line-height:1.75}@media(max-width:1000px){.course-grid,.square-shop-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.course-grid,.square-shop-grid{grid-template-columns:1fr}.square-shop{aspect-ratio:auto;min-height:220px}}
</style>`;

function listDirs(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

function courses() {
  const data = [
    ["타이(건식)", [["90분", "70,000"], ["120분", "80,000"], ["150분", "문의"]]],
    ["아로마(습식)", [["90분", "80,000"], ["120분", "100,000"], ["150분", "문의"]]],
    ["VIP 스페셜", [["90분", "문의"], ["120분", "100,000"], ["150분", "130,000"]]],
    ["시크릿 코스", [["가격", "전화 문의"], ["안내", "24시간 상담"], ["예약", "후불제"]]],
  ];
  return `<section class="section"><h2>마사지 코스 및 금액</h2><p class="lead">상담 시 지역, 시간대, 코스별 가능 여부와 추가 요금 여부를 함께 확인하세요.</p><div class="course-grid">${data.map(([title, rows]) => `<article class="course-card"><h3>${title}</h3>${rows.map(([label, price]) => `<div class="course-row"><span>${label}</span><strong>${price}</strong></div>`).join("")}</article>`).join("")}</div></section>`;
}

function shops(dong) {
  const names = ["프리미엄 홈타이", "힐링 아로마", "VIP 방문케어", "시그니처 케어"];
  const tags = ["빠른 상담", "후불 안내", "관리사 확인", "코스 비교"];
  return `<section class="section"><h2>${dong} 추천 업체</h2><div class="square-shop-grid">${names.map((name, index) => `<article class="square-shop"><div><span class="tagline">${tags[index]}</span><h3>${dong} ${name}</h3></div><p>예약 전 가능 시간, 관리사 스타일, 코스 구성, 요금 안내를 상담으로 확인할 수 있습니다.</p></article>`).join("")}</div></section>`;
}

function info(dong) {
  return `<section class="section"><div class="local-info"><article class="card"><h2>공지사항</h2><p class="lead">${dong} 방문 가능 여부는 시간대와 업체 배정 상황에 따라 달라질 수 있습니다.</p><ul><li>예약 전 코스 시간과 총 금액 확인</li><li>야간·외곽 지역 추가비 여부 확인</li><li>방문 주소와 주차 가능 여부 사전 전달</li></ul></article><article class="card"><h2>업체소개</h2><p class="lead">마사지허브는 지역별 제휴 가능 업체를 비교하기 쉽게 정리하는 중개형 안내 플랫폼입니다.</p><ul><li>지역명 기준 업체 정보 분류</li><li>상담 가능한 시간대 중심 안내</li><li>합법 웰니스 방문 케어 기준 운영</li></ul></article><article class="card"><h2>관리사정보</h2><p class="lead">관리사 성별, 경력, 케어 스타일, 가능 코스는 업체별로 다르며 예약 전 상담으로 확인합니다.</p><ul><li>타이·아로마·VIP 코스 가능 여부</li><li>방문 가능 시간과 배정 상황</li><li>초보 이용자를 위한 기본 안내</li></ul></article><article class="card"><h2>주의사항</h2><p class="lead">불법 성매매, 유사 성행위, 미성년자 관련 서비스는 등록과 노출을 허용하지 않습니다.</p><ul><li>예약 전 요금과 코스 범위 확인</li><li>과도한 음주 상태 이용 제한 가능</li><li>부적절한 요청 시 상담이 중단될 수 있음</li></ul></article></div></section>`;
}

for (const region of listDirs(root)) {
  for (const district of listDirs(join(root, region))) {
    for (const dong of listDirs(join(root, region, district))) {
      const file = join(root, region, district, dong, "index.html");
      if (!existsSync(file)) continue;
      let html = readFileSync(file, "utf8");
      if (!html.includes("course-grid")) html = html.replace("</head>", `${detailCss}</head>`);
      html = html.replace(/<section class="section"><h2>[^<]+ 추천 업체<\/h2>[\s\S]*?<\/section>/, `${courses()}${shops(dong)}`);
      html = html.replace(/<section class="section"><div class="local-info">[\s\S]*?<\/div><\/section>/, info(dong));
      writeFileSync(file, html, "utf8");
    }
  }
}
