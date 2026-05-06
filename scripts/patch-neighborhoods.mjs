import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const siteUrl = "https://massagepick.netlify.app";
const neighborhoods = {
  "서울": { "강남구": ["역삼동", "논현동", "신사동", "청담동", "삼성동", "대치동", "도곡동", "개포동", "일원동", "수서동", "세곡동"], "강동구": ["강일동", "상일동", "명일동", "고덕동", "암사동", "천호동", "성내동", "길동", "둔촌동"], "강북구": ["미아동", "번동", "수유동", "우이동", "삼양동", "송중동", "송천동", "인수동"], "강서구": ["염창동", "등촌동", "화곡동", "가양동", "마곡동", "공항동", "방화동", "우장산동", "발산동"], "관악구": ["보라매동", "은천동", "성현동", "청룡동", "낙성대동", "인헌동", "남현동", "신림동", "서림동", "난곡동", "난향동", "조원동", "대학동"], "광진구": ["중곡동", "능동", "구의동", "광장동", "자양동", "화양동", "군자동"], "구로구": ["신도림동", "구로동", "가리봉동", "고척동", "개봉동", "오류동", "수궁동", "항동"], "금천구": ["가산동", "독산동", "시흥동"], "노원구": ["월계동", "공릉동", "하계동", "중계동", "상계동"], "도봉구": ["쌍문동", "방학동", "창동", "도봉동"], "마포구": ["공덕동", "아현동", "도화동", "용강동", "대흥동", "염리동", "신수동", "서강동", "서교동", "합정동", "망원동", "연남동", "성산동", "상암동"], "서초구": ["서초동", "잠원동", "반포동", "방배동", "양재동", "내곡동"], "송파구": ["풍납동", "거여동", "마천동", "방이동", "오륜동", "오금동", "송파동", "석촌동", "삼전동", "가락동", "문정동", "장지동", "위례동", "잠실동"], "영등포구": ["영등포동", "여의동", "당산동", "도림동", "문래동", "양평동", "신길동", "대림동"], "용산구": ["후암동", "용산동", "남영동", "청파동", "원효로동", "효창동", "용문동", "한강로동", "이촌동", "이태원동", "한남동", "서빙고동", "보광동"] },
  "경기": { "수원시": ["장안구", "권선구", "팔달구", "영통구", "인계동", "매탄동", "영통동", "망포동", "광교동", "호매실동"], "성남시": ["수정구", "중원구", "분당구", "정자동", "서현동", "판교동", "야탑동", "위례동"], "용인시": ["처인구", "기흥구", "수지구", "신갈동", "동백동", "죽전동", "상현동", "성복동"], "고양시": ["덕양구", "일산동구", "일산서구", "화정동", "행신동", "장항동", "마두동", "대화동"], "부천시": ["심곡동", "중동", "상동", "소사본동", "괴안동", "오정동", "원종동"], "안양시": ["만안구", "동안구", "안양동", "평촌동", "범계동", "호계동", "관양동"], "화성시": ["봉담읍", "향남읍", "남양읍", "동탄동", "반월동", "병점동", "진안동", "새솔동"], "평택시": ["팽성읍", "안중읍", "포승읍", "청북읍", "송탄동", "비전동", "세교동", "고덕동"], "김포시": ["통진읍", "고촌읍", "양촌읍", "김포본동", "장기동", "구래동", "마산동", "운양동"], "하남시": ["천현동", "신장동", "덕풍동", "풍산동", "미사동", "위례동", "감일동"] },
  "인천": { "중구": ["신포동", "연안동", "신흥동", "도원동", "율목동", "동인천동", "개항동", "영종동", "운서동", "용유동"], "미추홀구": ["숭의동", "용현동", "학익동", "도화동", "주안동", "관교동", "문학동"], "연수구": ["옥련동", "선학동", "연수동", "청학동", "동춘동", "송도동"], "남동구": ["구월동", "간석동", "만수동", "장수서창동", "서창동", "남촌도림동", "논현동"], "부평구": ["부평동", "십정동", "산곡동", "청천동", "갈산동", "삼산동", "부개동", "일신동"], "계양구": ["효성동", "계산동", "작전동", "서운동", "계양동", "귤현동", "동양동"], "서구": ["검암경서동", "연희동", "청라동", "가정동", "석남동", "신현원창동", "가좌동", "검단동", "불로대곡동", "당하동", "원당동"], "강화군": ["강화읍", "선원면", "불은면", "길상면", "화도면", "양도면", "내가면", "하점면", "양사면", "송해면"], "옹진군": ["북도면", "백령면", "대청면", "덕적면", "영흥면", "자월면", "연평면"] }
};

const css = `<style>
.neighborhood-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:22px}.neighborhood-link{display:flex;align-items:center;justify-content:space-between;border:1px solid #3a2a1d;border-radius:12px;background:linear-gradient(180deg,#171717,#0f0f0f);padding:15px 16px;font-weight:900;color:#fff;min-height:56px}.neighborhood-link strong{color:var(--orange);font-size:18px;letter-spacing:0}.neighborhood-link:after{content:"›";color:#ffb06b;font-size:22px}.local-shop-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.local-shop{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:20px}.local-shop h3{margin:0 0 10px}.local-shop p{color:var(--muted);line-height:1.65}.local-info{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}@media(max-width:900px){.neighborhood-grid,.local-shop-grid,.local-info{grid-template-columns:1fr}}
</style>`;
const shopNames = ["프리미엄 홈타이", "힐링 아로마", "VIP 방문케어", "시그니처 케어"];

function enc(value) { return encodeURIComponent(value); }
function filePath(region, district, neighborhood) { return neighborhood ? `out/area/${region}/${district}/${neighborhood}/index.html` : `out/area/${region}/${district}/index.html`; }
function write(path, content) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content, "utf8"); }
function injectCss(html) { return html.includes("neighborhood-grid") ? html : html.replace("</head>", `${css}</head>`); }
function page(title, description, body) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><style>:root{--bg:#050505;--panel:#111;--text:#fff;--muted:#b8b8b8;--line:#2b2b2b;--orange:#ff7a1a;--pink:#ff5f7e}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:20;background:#050505;border-bottom:1px solid var(--line)}.top-inner{display:flex;align-items:center;justify-content:space-between;width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0}.brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:900}.brand-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:var(--orange)}.nav{display:flex;gap:20px;font-size:14px}.call-btn,.primary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:48px 0}.eyebrow{color:var(--pink);font-weight:900}.lead{color:var(--muted);font-size:18px;line-height:1.75}h1{font-size:clamp(38px,6vw,68px);line-height:1.05}.card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:20px}.footer{border-top:1px solid var(--line);margin-top:40px}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:32px 0}.mobile-call{display:none}@media(max-width:900px){.nav{display:none}.mobile-call{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;align-items:center;justify-content:center;gap:10px;min-height:58px;border-radius:8px;background:var(--orange);font-weight:900}body{padding-bottom:82px}}</style>${css}</head><body><header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">M</span>마사지허브</a><nav class="nav"><a href="/#price">요금표</a><a href="/#reviews">후기</a><a href="/#faq">FAQ</a><a href="/#map">지도</a><a href="tel:05082024683">전화예약</a></nav><a class="call-btn" href="tel:05082024683">0508-202-4683</a></div></header>${body}<footer class="footer"><div class="footer-inner"><strong>마사지허브</strong><p class="lead">서울, 경기, 인천 출장마사지 홈타이 지역 안내</p></div></footer><a class="mobile-call" href="tel:05082024683"><span>전화예약</span><strong>0508-202-4683</strong></a></body></html>`;
}

for (const [region, districts] of Object.entries(neighborhoods)) {
  for (const [district, dongs] of Object.entries(districts)) {
    const districtFile = filePath(region, district);
    if (existsSync(districtFile)) {
      let html = readFileSync(districtFile, "utf8");
      html = injectCss(html);
      const grid = `<section class="section"><h2>${district} 행정동 선택</h2><p class="lead">${district} 출장마사지와 홈타이 가능 지역을 행정동 기준으로 선택하세요.</p><div class="neighborhood-grid">${dongs.map((dong) => `<a class="neighborhood-link" href="/area/${enc(region)}/${enc(district)}/${enc(dong)}/"><strong>${dong}</strong></a>`).join("")}</div></section>`;
      html = html.replace(/<section class="section"><h2>[^<]+ 행정동 선택<\/h2>[\s\S]*?<\/section>/, "");
      html = html.replace("</main>", `${grid}</main>`);
      writeFileSync(districtFile, html, "utf8");
    }

    for (const dong of dongs) {
      const shops = shopNames.slice(0, 2 + ((region.length + district.length + dong.length) % 3));
      const body = `<main><section class="section"><p class="eyebrow">${region} ${district} ${dong}</p><h1>${region} ${district} ${dong} 출장마사지 홈타이</h1><p class="lead">${dong} 출장마사지와 홈타이 예약 시간, 신규 회원 할인, 관리사 스타일, 주의사항을 확인하고 전화로 바로 상담하세요.</p><a class="primary-btn" href="tel:05082024683">전화예약</a></section><section class="section"><h2>${dong} 추천 업체</h2><div class="local-shop-grid">${shops.map((name) => `<article class="local-shop"><h3>${dong} ${name}</h3><p>상담 후 가능 시간, 관리사 배정, 코스 상세, 후불 안내를 확인할 수 있습니다.</p></article>`).join("")}</div></section><section class="section"><div class="local-info"><article class="card"><h2>공지사항</h2><p class="lead">예약 전 가능 시간, 코스, 추가 요금을 확인해 주세요.</p></article><article class="card"><h2>업체소개</h2><p class="lead">마사지허브는 지역별 제휴 가능 업체를 정리하는 중개형 안내 플랫폼입니다.</p></article><article class="card"><h2>관리사정보</h2><p class="lead">관리사 성별, 경력, 가능 코스는 상담으로 안내됩니다.</p></article><article class="card"><h2>주의사항</h2><p class="lead">불법 서비스는 등록과 노출을 허용하지 않습니다.</p></article></div></section></main>`;
      write(filePath(region, district, dong), page(`${region} ${district} ${dong} 출장마사지 홈타이 | 마사지허브`, `${region} ${district} ${dong} 출장마사지, 홈타이 예약 시간과 관리사 정보, 주의사항을 확인하세요.`, body));
    }
  }
}

if (existsSync("out/sitemap.xml")) {
  let sitemap = readFileSync("out/sitemap.xml", "utf8");
  const urls = [];
  for (const [region, districts] of Object.entries(neighborhoods)) for (const [district, dongs] of Object.entries(districts)) for (const dong of dongs) urls.push(`<url><loc>${siteUrl}/area/${enc(region)}/${enc(district)}/${enc(dong)}/</loc></url>`);
  sitemap = sitemap.replace("</urlset>", `${urls.join("")}</urlset>`);
  writeFileSync("out/sitemap.xml", sitemap, "utf8");
}
