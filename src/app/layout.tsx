import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/regions";

const siteUrl = "https://massagepick.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "마사지허브 | 서울 경기 인천 출장마사지 홈타이 중개 플랫폼",
  description: "마사지허브는 서울, 경기, 인천 출장마사지와 홈타이 서비스 지역, 요금표, 후기, FAQ, 지도, 전화예약 정보를 안내하는 지역 기반 중개 플랫폼입니다.",
  keywords: ["출장마사지", "홈타이", "서울 출장마사지", "경기 출장마사지", "인천 출장마사지", "방문마사지", "마사지 요금표"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { title: "마사지허브", description: "서울 경기 인천 출장마사지 홈타이 지역 안내", type: "website", locale: "ko_KR", url: siteUrl, siteName: site.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}<a className="mobile-call" href={site.tel}><span>전화예약</span><strong>{site.phone}</strong></a></body></html>;
}
