import { getDistricts, pathFor } from "@/lib/regions";

const cardCopy = [
  "빠른 매칭 · 후불 결제 · 안정 운영",
  "근거리 우선 배정 · 후불제 · 상시 대응",
  "즉시 상담 · 신속 출동 · 후불 시스템",
  "편리 예약 · 빠른 방문 · 후불 결제",
  "예약 즉시 배정 · 24시간 지원",
];

export function DistrictCards() {
  const districts = getDistricts("서울").slice(0, 15);

  return <div className="district-card-grid">{districts.map((district, index) => <a className="district-card" href={pathFor("서울", district)} key={district}><div className={`district-photo photo-${index % 5}`}><span>구군</span><strong>{district.replace("구", "")}</strong></div><h3>{district} 출장마사지</h3><p>{cardCopy[index % cardCopy.length]}</p></a>)}</div>;
}
