import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const phone = "0508-202-4683";
const tel = "tel:05082024683";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const footerHtml = `<footer class="footer hub-footer">
  <div class="footer-inner hub-footer-inner">
    <section class="footer-about" aria-label="마사지허브 소개">
      <strong class="brand"><span class="brand-mark">M</span>마사지허브</strong>
      <p>마사지허브는 서울, 경기, 인천 출장마사지와 홈타이 가능 지역을 행정구와 행정동 기준으로 정리하는 지역 기반 예약 안내 플랫폼입니다. 예약 전 요금, 가능 시간, 코스 범위, 주의사항을 먼저 확인할 수 있도록 운영 정보를 깔끔하게 안내합니다.</p>
    </section>
    <section class="footer-contact" aria-label="고객센터 및 운영시간">
      <div class="footer-info-card">
        <span>고객센터</span>
        <a href="${tel}">${phone}</a>
      </div>
      <div class="footer-info-card">
        <span>출장마사지 운영시간</span>
        <strong>오전 11시 ~ 익일 오전 8시</strong>
      </div>
      <div class="footer-info-card">
        <span>운영일</span>
        <strong>연중무휴</strong>
      </div>
    </section>
    <p class="footer-note">불법 서비스는 등록과 노출을 허용하지 않습니다. 예약 전 실제 가능 시간, 요금, 코스 안내를 전화로 확인해 주세요.</p>
  </div>
</footer>`;

const footerCss = `.hub-footer{border-top:1px solid #2b2b2b;background:#070707;margin-top:48px}.hub-footer-inner{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);gap:24px;align-items:start}.footer-about p{margin:16px 0 0;color:#bdbdbd;line-height:1.8;font-size:15px}.footer-contact{display:grid;grid-template-columns:1fr;gap:10px}.footer-info-card{border:1px solid #352617;border-radius:12px;background:linear-gradient(180deg,#141414,#0f0f0f);padding:15px 16px}.footer-info-card span{display:block;margin-bottom:7px;color:#ff8a2a;font-size:13px;font-weight:900}.footer-info-card a,.footer-info-card strong{color:#fff;font-size:18px;font-weight:900}.footer-note{grid-column:1/-1;margin:0;padding-top:16px;border-top:1px solid #222;color:#9f9f9f;font-size:13px;line-height:1.7}@media(max-width:900px){.hub-footer-inner{grid-template-columns:1fr}.footer-info-card a,.footer-info-card strong{font-size:16px}}`;

for (const file of walk(outDir).filter((path) => path.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  if (!html.includes("<footer")) continue;

  html = html.replace(/<footer class="footer(?: [^"]*)?">[\s\S]*?<\/footer>/g, footerHtml);

  if (!html.includes(".hub-footer{")) {
    html = html.replace("</style>", `${footerCss}</style>`);
  }

  writeFileSync(file, html, "utf8");
}
