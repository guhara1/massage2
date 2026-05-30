import type { Metadata } from "next";
import { Faq, Footer, Header, InfoSections, PriceTable, SeoIntro, Shops } from "@/components/site";
import { areaDescription, areaTitle, getNeighborhoods, pathFor } from "@/lib/regions";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ region: string; district: string; neighborhood: string }> };

export async function generateStaticParams() { const { regions } = await import("@/lib/regions"); return Object.entries(regions).flatMap(([region, districts]) => Object.entries(districts).flatMap(([district, neighborhoods]) => neighborhoods.map((neighborhood) => ({ region, district, neighborhood })))); }

export async function generateMetadata({ params }: Props): Promise<Metadata> { const { region, district, neighborhood } = await params; const r = decodeURIComponent(region); const d = decodeURIComponent(district); const n = decodeURIComponent(neighborhood); return { title: areaTitle(r, d, n), description: areaDescription(r, d, n), alternates: { canonical: pathFor(r, d, n) } }; }

export default async function NeighborhoodPage({ params }: Props) { const { region, district, neighborhood } = await params; const r = decodeURIComponent(region); const d = decodeURIComponent(district); const n = decodeURIComponent(neighborhood); if (!getNeighborhoods(r, d).includes(n)) notFound(); const seed = `${r} ${d} ${n}`; return <><Header /><main><section className="section hero"><div><SeoIntro region={r} district={d} neighborhood={n} /><div className="hero-actions"><a className="primary-btn" href="tel:05082024683">전화예약</a><a className="outline-btn" href="#shops">업체 보기</a></div></div><div className="panel"><h2>{n} 핵심 안내</h2><p className="lead">출장마사지, 방문마사지 가능 업체를 상담 기준으로 확인하세요.</p></div></section><section className="section" id="shops"><div className="section-head"><h2>{n} 추천 업체</h2><p className="lead">페이지마다 2~4개 업체가 지역명 기준으로 표시됩니다.</p></div><Shops seed={seed} /></section><section className="section"><InfoSections region={r} district={d} neighborhood={n} /></section><section className="section" id="price"><div className="section-head"><h2>{n} 마사지 가격</h2></div><PriceTable /></section><section className="section" id="faq"><div className="section-head"><h2>{n} 자주 묻는 질문</h2></div><Faq region={r} district={d} neighborhood={n} /></section></main><Footer /></>; }
