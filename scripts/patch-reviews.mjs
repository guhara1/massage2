import { existsSync, readFileSync, writeFileSync } from "node:fs";

const reviewFiles = ["out/index.html", "out/reviews/index.html"];
const regions = {
  "서울": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "마포구", "서초구", "송파구", "영등포구", "용산구"],
  "경기": ["수원시", "성남시", "용인시", "고양시", "부천시", "안양시", "화성시", "평택시", "김포시", "하남시"],
  "인천": ["중구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
};
const regionSummaries = {
  "서울": { title: "서울", text: "강남·송파·마포 중심", tags: ["강남구", "송파구", "마포구"] },
  "경기": { title: "경기", text: "수원·성남·용인 생활권", tags: ["수원시", "성남시", "용인시"] },
  "인천": { title: "인천", text: "송도·부평·영종 권역", tags: ["연수구", "부평구", "중구"] },
};
const blurbs = ["빠른 매칭 · 후불 결제 · 안정 운영", "근거리 우선 배정 · 상시 대응", "즉시 상담 · 신속 출동", "편리 예약 · 빠른 방문", "예약 즉시 배정 · 24시간 지원"];
const polishCss = `<style>
.panel{padding:24px!important;border-radius:16px!important;background:linear-gradient(180deg,#151515,#0b0b0b)!important}.panel h2{color:var(--orange)!important;font-size:30px!important;margin-bottom:18px!important}.panel .grid-3{gap:12px!important}.quick-region-card{position:relative;display:block;min-height:176px;border:1px solid #33261b;border-radius:14px;background:linear-gradient(180deg,#151515,#0e0e0e);padding:18px;overflow:hidden}.quick-region-card:before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,122,26,.14),transparent 45%);opacity:.9}.quick-region-card h3,.quick-region-card p,.quick-region-card .quick-tags{position:relative}.quick-region-card h3{margin:0 0 10px!important;color:#fff!important;font-size:20px!important;line-height:1.25}.quick-region-card h3 strong{color:var(--orange)!important}.quick-region-card p{margin:0 0 14px!important;color:#d8d8d8!important;line-height:1.55!important;font-size:15px!important}.quick-tags{display:flex;flex-wrap:wrap;gap:6px}.quick-tags span{border:1px solid rgba(255,122,26,.35);border-radius:999px;background:rgba(255,122,26,.1);color:#ffb06b;padding:6px 8px;font-size:12px;font-weight:900}@media(max-width:900px){.panel h2{font-size:26px!important}.quick-region-card{min-height:auto}}
</style>`;
const sliderCss = `<style>
.review-grid{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:calc((100% - 14px)/2)!important;grid-template-columns:none!important;gap:14px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;scroll-behavior:smooth!important;padding:4px 2px 18px!important;scrollbar-width:thin!important;scrollbar-color:var(--orange) #1a1a1a!important}
.review-grid::-webkit-scrollbar{height:9px}.review-grid::-webkit-scrollbar-track{background:#1a1a1a;border-radius:999px}.review-grid::-webkit-scrollbar-thumb{background:var(--orange);border-radius:999px}.review-card{scroll-snap-align:start!important;min-height:220px!important}.review-foot{display:block!important;margin-top:16px!important}.review-foot a{display:none!important}@media(max-width:760px){.review-grid{grid-auto-columns:86%!important}.review-card{min-height:auto!important}}
</style>`;
const autoSlideScript = `<script>
(function(){
  function setupReviewSlider(){
    document.querySelectorAll('.review-grid').forEach(function(slider){
      if (slider.dataset.autoSlide === 'on') return;
      slider.dataset.autoSlide = 'on';
      var paused = false;
      slider.addEventListener('mouseenter', function(){ paused = true; });
      slider.addEventListener('mouseleave', function(){ paused = false; });
      setInterval(function(){
        if (paused) return;
        var step = Math.max(1, slider.clientWidth + 14);
        var nearEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
        slider.scrollTo({ left: nearEnd ? 0 : slider.scrollLeft + step, behavior: 'smooth' });
      }, 2000);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupReviewSlider);
  else setupReviewSlider();
})();
</script>`;

function enc(value) {
  return encodeURIComponent(value);
}

function quickRegionCards() {
  return Object.entries(regionSummaries).map(([region, item]) => `<a class="quick-region-card" href="/area/${enc(region)}/"><h3><strong>${item.title}</strong> 출장마사지</h3><p>${item.text}<br>지역별 홈타이 상담 안내</p><div class="quick-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div></a>`).join("");
}

function districtSection(region) {
  const cards = regions[region].map((district, index) => `<a class="district" href="/area/${enc(region)}/${enc(district)}/"><div class="district-img"><span>구군</span></div><h3>${district} 출장마사지</h3><p class="muted">${blurbs[index % blurbs.length]}</p></a>`).join("");
  return `<section class="section"><h2>${region} 인기 구군</h2><div class="district-grid">${cards}</div></section>`;
}

for (const file of reviewFiles) {
  if (!existsSync(file)) continue;
  let html = readFileSync(file, "utf8");
  html = html.replace(/<div class="review-foot"><strong>([^<]+)<\/strong><a href="tel:05082024683">전화예약<\/a><\/div>/g, '<div class="review-foot"><strong>$1</strong></div>');
  if (!html.includes("grid-auto-columns:calc((100% - 14px)/2)")) html = html.replace("</head>", `${sliderCss}</head>`);
  if (!html.includes("quick-region-card")) html = html.replace("</head>", `${polishCss}</head>`);
  if (!html.includes("dataset.autoSlide")) html = html.replace("</body>", `${autoSlideScript}</body>`);
  writeFileSync(file, html, "utf8");
}

if (existsSync("out/index.html")) {
  let home = readFileSync("out/index.html", "utf8");
  home = home.replace(/<section class="section"><h2>서울 인기 구군<\/h2><div class="district-grid">[\s\S]*?<\/div><\/section>/, "");
  home = home.replace(/<div class="panel"><h2>빠른 지역 선택<\/h2><div class="grid-3">[\s\S]*?<\/div><\/div><\/section>/, `<div class="panel"><h2>빠른 지역 선택</h2><div class="grid-3">${quickRegionCards()}</div></div></section>`);
  writeFileSync("out/index.html", home, "utf8");
}

for (const region of Object.keys(regions)) {
  const file = `out/area/${region}/index.html`;
  if (!existsSync(file)) continue;
  let html = readFileSync(file, "utf8");
  html = html.replace(/<div class="links">[\s\S]*?<\/div><\/section>/, `<div class="links">${regions[region].map((district) => `<a href="/area/${enc(region)}/${enc(district)}/">${district}</a>`).join("")}</div></section>${districtSection(region)}`);
  writeFileSync(file, html, "utf8");
}
