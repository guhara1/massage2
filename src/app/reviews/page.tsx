import type { Metadata } from "next";
import { Reviews } from "@/components/reviews";
import { Footer, Header } from "@/components/site";

export const metadata: Metadata = {
  title: "마사지허브 고객 후기 | 출장마사지 예약 이용 후기",
  description: "서울, 경기, 인천 출장마사지 예약 상담을 이용한 고객 후기 10개를 확인하세요. 응답 속도, 예약 시간, 요금 확인, 지역 방문 안내를 정리했습니다.",
  alternates: { canonical: "/reviews/" },
};

export default function ReviewsPage() {
  return <><Header /><main><section className="section"><p className="eyebrow">실제 상담 흐름 기준 후기</p><h1>마사지허브 고객 후기</h1><p className="lead">서울, 경기, 인천 지역에서 전화 상담과 예약 안내를 이용한 고객 후기를 정리했습니다. 새로고침할 때마다 후기 순서가 바뀝니다.</p></section><section className="section"><Reviews /></section></main><Footer /></>;
}
