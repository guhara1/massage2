import type { Metadata } from "next";
import { AreaLinkGrid, Footer, Header, PriceTable, SeoIntro } from "@/components/site";
import { areaDescription, areaTitle, getPrimaryRegions, pathFor } from "@/lib/regions";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ region: string }> };

export function generateStaticParams() { return getPrimaryRegions().map((region) => ({ region })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> { const { region } = await params; const r = decodeURIComponent(region); return { title: areaTitle(r), description: areaDescription(r), alternates: { canonical: pathFor(r) } }; }

export default async function RegionPage({ params }: Props) { const { region } = await params; const r = decodeURIComponent(region); if (!getPrimaryRegions().includes(r)) notFound(); return <><Header /><main><section className="section hero"><div><SeoIntro region={r} /></div><div className="panel"><h2>{r} 행정구 선택</h2><AreaLinkGrid region={r} /></div></section><section className="section" id="price"><PriceTable /></section></main><Footer /></>; }
