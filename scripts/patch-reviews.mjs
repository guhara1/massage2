import { existsSync, readFileSync, writeFileSync } from "node:fs";

const files = ["out/index.html", "out/reviews/index.html"];
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

for (const file of files) {
  if (!existsSync(file)) continue;
  let html = readFileSync(file, "utf8");
  html = html.replace(/<div class="review-foot"><strong>([^<]+)<\/strong><a href="tel:05082024683">전화예약<\/a><\/div>/g, '<div class="review-foot"><strong>$1</strong></div>');
  if (!html.includes("grid-auto-columns:calc((100% - 14px)/2)")) {
    html = html.replace("</head>", `${sliderCss}</head>`);
  }
  if (!html.includes("dataset.autoSlide")) {
    html = html.replace("</body>", `${autoSlideScript}</body>`);
  }
  writeFileSync(file, html, "utf8");
}
