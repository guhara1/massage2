import type { Metadata } from "next";
import { AreaLinkGrid, Footer, Header, PriceTable, SeoIntro } from "@/components/site";
import { areaDescription, areaTitle, getDistricts, pathFor } from "@/lib/regions";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ region: string; district: string }> };

export async function generateStaticParams() { const { regions } = await import("@/lib/regions"); return Object.entries(regions).flatMap(([region, districts]) => Object.keys(districts).map((district) => ({ region, district }))); }

export async function generateMetadata({ params }: Props): Promise<Metadata> { const { region, district } = await params; const r = decodeURIComponent(region); const d = decodeURIComponent(district); return { title: areaTitle(r, d), description: areaDescription(r, d), alternates: { canonical: pathFor(r, d) } }; }

export default async function DistrictPage({ params }: Props) { const { region, district } = await params; const r = decodeURIComponent(region); const d = decodeURIComponent(district); if (!getDistricts(r).includes(d)) notFound(); return <><Header /><main><section className="section hero"><div><SeoIntro region={r} district={d} /></div><div className="panel"><h2>{d} 행정동 선택</h2><AreaLinkGrid region={r} district={d} /></div></section><section className="section" id="price"><PriceTable /></section></main><Footer /></>; }
