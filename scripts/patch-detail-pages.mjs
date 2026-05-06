import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "out/area";
const detailCss = `<style>
.course-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.course-card{border:1px solid #33261b;border-radius:14px;background:#151313;padding:18px}.course-card h3{margin:0 0 16px;color:#ff7a1a}.course-row{display:flex;justify-content:space-between;border-bottom:1px dashed #333;padding:10px 0}.square-shop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.square-shop{aspect-ratio:1/1;border:1px solid #2b2b2b;border-radius:14px;background:linear-gradient(180deg,#151515,#0d0d0d);padding:18px;display:flex;flex-direction:column;justify-content:space-between}.square-shop h3{margin:0;font-size:20px;line-height:1.35}.square-shop p{margin:0;color:#b8b8b8;line-height:1.55}.square-shop .tagline{color:#ffb06b;font-size:13px;font-weight:900}.local-info .card p{font-size:17px}.local-info ul{margin:14px 0 0;padding-left:18px;color:#b8b8b8;line-height:1.75}.local-context{border:1px solid #33261b;border-radius:14px;background:linear-gradient(180deg,#15120f,#101010);padding:22px}.local-context p{margin:0;color:#d8d8d8;line-height:1.8;font-size:17px}@media(max-width:1000px){.course-grid,.square-shop-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.course-grid,.square-shop-grid{grid-template-columns:1fr}.square-shop{aspect-ratio:auto;min-height:220px}}
</style>`;

function listDirs(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

function score(...parts) {
  return parts.join("").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pick(list, seed, offset = 0) {
  return list[(seed + offset) % list.length];
}

function localProfile(region, district, dong) {
  const seed = score(region, district, dong);
  const regionTone = {
    서울: "도심 이동이 많고 예약 시간대가 촘촘한 지역권",
    경기: "주거지와 업무지구가 함께 분포한 광역 생활권",
    인천: "항만, 공항, 신도시, 원도심 수요가 함께 섞이는 지역권",
  }[region] || "생활권별 이동 동선이 다른 지역권";

  const access = pick([
    "역세권과 주거 단지가 함께 있어 방문 시간 조율이 중요합니다",
    "아파트 단지와 상가 밀집 구역이 섞여 주소 확인을 먼저 진행하는 편이 좋습니다",
    "업무지구 이용자와 거주 고객의 예약 시간이 다르게 몰리는 편입니다",
    "주차 가능 여부와 건물 출입 방식에 따라 배정 시간이 달라질 수 있습니다",
    "야간 상담 수요가 있어 가능 시간대를 먼저 확인하는 흐름이 적합합니다",
  ], seed);
  const demand = pick([
    "퇴근 이후 피로 관리와 짧은 회복 코스 문의가 많은 편입니다",
    "초보 이용자는 기본 코스와 추가 비용 확인을 먼저 요청하는 경우가 많습니다",
    "장시간 코스보다 90분, 120분 중심의 비교 문의가 자주 들어옵니다",
    "커플, 1인 이용, 숙소 방문 등 상황별 안내가 필요한 지역입니다",
    "신규 회원 할인과 후불 안내를 함께 확인하려는 상담이 많은 편입니다",
  ], seed, 1);
  const operation = pick([
    "가까운 제휴 가능 업체부터 확인해 이동 부담을 줄이는 방식으로 안내합니다",
    "예약 전 코스 범위, 관리사 스타일, 예상 도착 시간을 순서대로 확인합니다",
    "상담 시 불필요한 과장 표현보다 실제 가능 여부와 요금 확인을 우선합니다",
    "방문 주소, 엘리베이터 이용, 주차 조건을 함께 확인해 배정 오류를 줄입니다",
    "심야 시간대에는 가능 업체와 추가 비용 여부를 먼저 체크합니다",
  ], seed, 2);
  const caution = pick([
    "오피스텔, 호텔, 자택 방문은 출입 안내를 미리 전달하면 상담이 빠릅니다",
    "외곽 또는 교통 혼잡 시간에는 예상 방문 시간이 길어질 수 있습니다",
    "예약 확정 전에는 총 금액과 코스 시간을 문자 또는 통화로 다시 확인하는 것이 좋습니다",
    "부적절한 요청은 상담이 중단될 수 있어 합법 웰니스 케어 기준으로 이용해야 합니다",
    "과도한 음주 상태에서는 안전 기준에 따라 이용이 제한될 수 있습니다",
  ], seed, 3);

  return { seed, regionTone, access, demand, operation, caution };
}

function courses(region, district, dong) {
  const profile = localProfile(region, district, dong);
  const data = [
    ["타이(건식)", [["90분", "70,000"], ["120분", "80,000"], ["150분", "문의"]]],
    ["아로마(습식)", [["90분", "80,000"], ["120분", "100,000"], ["150분", "문의"]]],
    ["VIP 스페셜", [["90분", "문의"], ["120분", "100,000"], ["150분", "130,000"]]],
    ["시크릿 코스", [["가격", "전화 문의"], ["안내", "24시간 상담"], ["예약", "후불제"]]],
  ];
  return `<section class="section"><h2>${dong} 마사지 코스 및 금액</h2><p class="lead">${region} ${district} ${dong} 지역은 ${profile.regionTone}입니다. ${profile.access}. 상담 시 지역, 시간대, 코스별 가능 여부와 추가 요금 여부를 함께 확인하세요.</p><div class="course-grid">${data.map(([title, rows]) => `<article class="course-card"><h3>${title}</h3>${rows.map(([label, price]) => `<div class="course-row"><span>${label}</span><strong>${price}</strong></div>`).join("")}</article>`).join("")}</div></section>`;
}

function shops(region, district, dong) {
  const profile = localProfile(region, district, dong);
  const names = ["프리미엄 홈타이", "힐링 아로마", "VIP 방문케어", "시그니처 케어"];
  const tags = ["빠른 상담", "후불 안내", "관리사 확인", "코스 비교"];
  const shopNotes = [
    `${dong} 생활권 기준으로 가까운 방문 가능 업체를 먼저 확인합니다.`,
    `${district} 내 이동 동선을 고려해 예상 도착 시간과 코스 구성을 안내합니다.`,
    `${profile.demand} 상담 단계에서 가능 여부를 먼저 정리합니다.`,
    `${profile.operation} 예약 전 확인 절차를 간단하게 맞춥니다.`,
  ];
  return `<section class="section"><h2>${dong} 추천 업체</h2><div class="square-shop-grid">${names.map((name, index) => `<article class="square-shop"><div><span class="tagline">${tags[index]}</span><h3>${dong} ${name}</h3></div><p>${shopNotes[index]}</p></article>`).join("")}</div></section>`;
}

function info(region, district, dong) {
  const profile = localProfile(region, district, dong);
  const seed = profile.seed;
  const noticeItems = [
    `${dong} 방문 주소와 건물 출입 방법을 예약 전에 전달해 주세요`,
    pick(["야간 시간대는 추가비 여부를 먼저 확인합니다", "퇴근 이후 예약은 가능 시간대 확인이 우선입니다", "주말과 공휴일은 업체 배정 상황이 빠르게 변할 수 있습니다"], seed),
    pick(["주차가 어려운 건물은 근처 정차 가능 지점을 함께 안내해 주세요", "호텔, 오피스텔, 자택 방문은 정확한 동호수 확인이 필요합니다", "외곽 이동이 필요한 경우 예상 도착 시간이 달라질 수 있습니다"], seed, 1),
  ];
  const introItems = [
    `${region} ${district} ${dong} 기준으로 상담 가능한 제휴 업체를 분류합니다`,
    `${profile.operation}`,
    pick(["상담 가능한 시간대와 코스 구성을 한 번에 비교할 수 있게 정리합니다", "요금표와 실제 가능 여부를 함께 확인하는 안내 방식을 사용합니다", "지역명만 나열하지 않고 방문 조건과 이용 흐름을 같이 안내합니다"], seed, 2),
  ];
  const managerItems = [
    pick(["타이, 아로마, VIP 코스 가능 여부를 상담 시 확인합니다", "관리사 경력과 케어 스타일은 업체별 배정 상황에 따라 달라집니다", "초보 이용자는 기본 코스부터 안내받는 방식이 적합합니다"], seed),
    `${profile.demand}`,
    pick(["예약 전 성별, 코스 범위, 방문 가능 시간을 함께 확인합니다", "관리사 지정은 가능 업체 상황에 따라 안내됩니다", "장시간 코스는 사전 상담으로 가능 여부를 먼저 확인합니다"], seed, 1),
  ];
  const cautionItems = [
    `${profile.caution}`,
    "불법 성매매, 유사 성행위, 미성년자 관련 서비스는 허용하지 않습니다",
    pick(["예약 전 총 금액과 코스 범위를 다시 확인해 주세요", "과도한 음주 상태에서는 이용이 제한될 수 있습니다", "부적절한 요청이 있을 경우 상담 또는 방문이 중단될 수 있습니다"], seed, 2),
  ];

  return `<section class="section"><div class="local-context"><p><strong>${dong} 지역 안내:</strong> ${region} ${district} ${dong}은 ${profile.regionTone}으로, ${profile.access}. ${profile.demand}. 마사지허브는 이 차이를 반영해 예약 전 확인해야 할 운영 정보와 주의사항을 지역별로 안내합니다.</p></div></section><section class="section"><div class="local-info"><article class="card"><h2>공지사항</h2><p class="lead">${dong} 예약은 시간대와 업체 배정 상황에 따라 달라질 수 있어 아래 항목을 먼저 확인합니다.</p><ul>${noticeItems.map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="card"><h2>업체소개</h2><p class="lead">마사지허브는 ${dong} 주변 출장마사지와 홈타이 가능 업체를 비교하기 쉽게 정리하는 안내 플랫폼입니다.</p><ul>${introItems.map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="card"><h2>관리사정보</h2><p class="lead">${dong} 관리사 배정은 코스, 시간, 업체 상황에 따라 달라지므로 상담 단계에서 세부 정보를 확인합니다.</p><ul>${managerItems.map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="card"><h2>주의사항</h2><p class="lead">${dong} 출장 케어는 합법 웰니스 방문 관리 기준으로만 안내하며, 예약 전 이용 조건을 확인해야 합니다.</p><ul>${cautionItems.map((item) => `<li>${item}</li>`).join("")}</ul></article></div></section>`;
}

for (const region of listDirs(root)) {
  for (const district of listDirs(join(root, region))) {
    for (const dong of listDirs(join(root, region, district))) {
      const file = join(root, region, district, dong, "index.html");
      if (!existsSync(file)) continue;
      let html = readFileSync(file, "utf8");
      if (!html.includes("course-grid")) html = html.replace("</head>", `${detailCss}</head>`);
      html = html.replace(/<section class="section"><h2>[^<]+ 추천 업체<\/h2>[\s\S]*?<\/section>/, `${courses(region, district, dong)}${shops(region, district, dong)}`);
      html = html.replace(/<section class="section"><div class="local-info">[\s\S]*?<\/div><\/section>/, info(region, district, dong));
      writeFileSync(file, html, "utf8");
    }
  }
}
