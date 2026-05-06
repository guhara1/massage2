import { areaDescription, areaTitle, getDistricts, getNeighborhoods, getPrimaryRegions, pathFor, site } from "@/lib/regions";

const primaryRegionCopy: Record<string, string> = {
  서울: "강남, 마포, 송파, 영등포처럼 이동 수요가 많은 서울권을 구별로 나눠 정리했습니다. 업무지구, 주거지, 호텔 밀집 지역에서 출장마사지와 홈타이 상담 가능 구역을 빠르게 확인할 수 있습니다.",
  경기: "수원, 성남, 용인, 고양 등 생활권이 넓은 경기 지역은 도시별 이동 거리와 예약 가능 시간을 함께 보는 것이 중요합니다. 시 단위 페이지에서 가까운 출장마사지 연결 동선을 확인하세요.",
  인천: "송도, 청라, 부평, 구월동, 영종도처럼 생활권이 다른 인천 지역을 권역별로 안내합니다. 공항권, 해안권, 도심권 홈타이 상담 가능 여부를 지역 페이지에서 비교할 수 있습니다.",
};

export function Header() {
  return <header className="topbar"><div className="top-inner"><a className="brand" href="/"><span className="brand-mark">M</span>{site.name}</a><nav className="nav"><a href="/#price">요금표</a><a href="/#reviews">후기</a><a href="/#faq">FAQ</a><a href="/#map">지도</a><a href={site.tel}>전화예약</a></nav><a className="call-btn" href={site.tel}>{site.phone}</a></div></header>;
}

export function Footer() {
  const links = getPrimaryRegions().flatMap((region) => getDistricts(region).slice(0, 12).map((district) => ({ label: `${region} ${district} 출장마사지`, href: pathFor(region, district) })));
  return <footer className="site-footer"><div className="footer-inner"><strong className="brand"><span className="brand-mark">M</span>{site.name}</strong><p className="lead">서울, 경기, 인천 출장마사지와 홈타이 지역 정보를 타이틀, 설명, 요금표, 주의사항, FAQ 기준으로 정리합니다.</p><div className="footer-links">{links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</div></div></footer>;
}

export function PriceTable() {
  const data = [
    ["타이(건식)", [["90분", "70,000"], ["120분", "80,000"], ["150분", "문의"]]],
    ["아로마(습식)", [["90분", "80,000"], ["120분", "100,000"], ["150분", "문의"]]],
    ["VIP 스페셜", [["90분", "문의"], ["120분", "100,000"], ["150분", "130,000"]]],
    ["시크릿 코스", [["가격", "전화 문의"], ["안내", "24시간 상담"], ["예약", "후불제"]]],
  ];
  return <div className="price-grid">{data.map(([title, rows]) => <article className="price-card" key={title as string}><h3>{title as string}</h3>{(rows as string[][]).map(([time, price]) => <div className="price-row" key={time}><span>{time}</span><strong>{price}</strong></div>)}</article>)}</div>;
}

export function RegionCards() {
  return <div className="region-grid">{getPrimaryRegions().map((region) => <a className="region-card" href={pathFor(region)} key={region}><h3>{region} 출장마사지</h3><p>{primaryRegionCopy[region] ?? areaDescription(region)}</p></a>)}</div>;
}

export function AreaLinkGrid({ region, district }: { region: string; district?: string }) {
  const items = district ? getNeighborhoods(region, district).map((name) => ({ name, href: pathFor(region, district, name) })) : getDistricts(region).map((name) => ({ name, href: pathFor(region, name) }));
  return <div className="list-grid">{items.map((item) => <a className="area-link" href={item.href} key={item.href}>{item.name}</a>)}</div>;
}

export function Shops({ seed }: { seed: string }) {
  const base = ["프리미엄 홈타이", "힐링 아로마", "VIP 방문케어", "더블유 테라피", "시그니처 케어", "로얄 홈케어"];
  const count = 2 + (seed.length % 3);
  return <div className="shop-list">{base.slice(seed.length % 2, seed.length % 2 + count).map((name) => <article className="shop-card" key={name}><h3>{seed} {name}</h3><p>전화 상담 후 가능 시간, 관리사 배정, 코스 상세를 확인할 수 있습니다.</p><div className="shop-meta"><span className="tag">24시간 상담</span><span className="tag">후불제 안내</span><span className="tag">지역 방문</span></div><a className="primary-btn" href={site.tel} style={{marginTop:14}}>전화예약</a></article>)}</div>;
}

export function InfoSections({ region, district, neighborhood }: { region: string; district?: string; neighborhood?: string }) {
  const area = [region, district, neighborhood].filter(Boolean).join(" ");
  const cards = [
    ["공지사항", `${area} 출장마사지와 홈타이 예약 전 가능 시간, 코스, 추가 요금을 전화로 확인해 주세요.`],
    ["업체소개", "마사지허브는 지역별 제휴 가능 업체 정보를 비교하기 쉽게 정리하는 중개형 안내 플랫폼입니다."],
    ["기타사항", "숙소, 자택, 오피스텔 방문 가능 여부는 주소와 시간대에 따라 달라질 수 있습니다."],
    ["관리사정보", "관리사 성별, 경력, 가능 코스는 업체별로 다르며 예약 전 상담으로 확인합니다."],
    ["주의사항", "불법 성매매, 유사 성행위, 미성년자 관련 서비스는 등록과 노출을 허용하지 않습니다."],
  ];
  return <div className="info-grid">{cards.map(([title, text]) => <article className="info-card" key={title}><h2>{title}</h2><p>{text}</p></article>)}</div>;
}

export function Faq({ region, district, neighborhood }: { region: string; district?: string; neighborhood?: string }) {
  const area = [region, district, neighborhood].filter(Boolean).join(" ");
  const faqs = [
    [`${area} 출장마사지는 바로 예약 가능한가요?`, "업체 상황에 따라 다르며 전화 상담으로 가능 시간과 코스를 확인할 수 있습니다."],
    ["홈타이와 출장마사지 차이는 무엇인가요?", "둘 다 방문형 케어를 의미하며 업체별 코스 구성과 관리 방식이 다를 수 있습니다."],
    ["요금은 고정인가요?", "기본 요금표는 안내 기준이며 지역, 시간대, 코스에 따라 달라질 수 있습니다."],
    ["관리사 정보는 확인 가능한가요?", "성별, 경력, 가능 코스는 전화 상담 시 업체를 통해 확인하는 방식입니다."],
    ["불법 서비스도 중개하나요?", "아니요. 마사지허브는 합법 웰니스 방문 케어 안내만을 기준으로 합니다."],
  ];
  return <div className="faq-list">{faqs.map(([q, a]) => <details className="faq-card" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>;
}

export function SeoIntro({ region, district, neighborhood }: { region: string; district?: string; neighborhood?: string }) {
  return <><p className="eyebrow">출장마사지 · 홈타이 · 방문마사지</p><h1>{areaTitle(region, district, neighborhood)}</h1><p className="hero-copy lead">{areaDescription(region, district, neighborhood)}</p></>;
}
