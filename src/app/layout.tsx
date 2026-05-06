import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/regions";

const siteUrl = "https://massagepick.netlify.app";
const title = "출장마사지 & 홈타이 “마사지허브” – 공식 예약 및 주의사항, 관리사 정보";
const description = "출장마사지 및 홈타이 전문 “마사지허브” 공식 소개. 예약 시간, 신규 회원 5% 할인, 관리사 스타일, 주의사항 5가지, 자주 묻는 질문 정리. 2021년부터 운영. 실제 운영자 작성.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: ["출장마사지", "홈타이", "마사지허브", "출장마사지 예약", "홈타이 예약", "관리사 정보", "마사지 주의사항", "신규 회원 할인"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { title, description, type: "website", locale: "ko_KR", url: siteUrl, siteName: site.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}<a className="mobile-call" href={site.tel}><span>전화예약</span><strong>{site.phone}</strong></a></body></html>;
}
