"use client";

import { useMemo } from "react";
import { site } from "@/lib/regions";

const reviews = [
  { area: "서울 강남구", name: "김OO", text: "야근 끝나고 시간이 애매했는데 상담이 빨라서 좋았습니다. 가능한 코스와 도착 시간을 먼저 알려줘서 예약하기 편했어요." },
  { area: "서울 마포구", name: "박OO", text: "처음 이용이라 요금이 걱정됐는데 전화로 추가 비용 여부를 확인하고 진행할 수 있었습니다. 안내가 차분해서 믿음이 갔습니다." },
  { area: "서울 송파구", name: "이OO", text: "잠실 근처에서 찾다가 연결했는데 응답이 빨랐습니다. 코스 설명이 복잡하지 않고 필요한 부분만 정리해줘서 좋았어요." },
  { area: "경기 수원시", name: "최OO", text: "지역 선택이 잘 나뉘어 있어서 권선구 쪽 가능 여부를 바로 확인했습니다. 예약 전 요금표를 볼 수 있는 점이 편했습니다." },
  { area: "경기 성남시", name: "정OO", text: "분당 쪽 홈타이를 찾고 있었는데 상담 연결 후 가능한 시간대를 바로 안내받았습니다. 늦은 시간에도 응대가 괜찮았습니다." },
  { area: "경기 용인시", name: "한OO", text: "동네별로 페이지가 있어서 검색하다 들어왔습니다. 전화 연결이 바로 보여서 모바일에서 예약하기 수월했습니다." },
  { area: "경기 고양시", name: "윤OO", text: "일산 쪽 출장마사지 가능 업체를 비교하려고 봤습니다. 공지사항과 주의사항이 같이 있어서 확인할 부분이 명확했습니다." },
  { area: "인천 연수구", name: "오OO", text: "송도 근처에서 이용 가능한지 문의했는데 답변이 빨랐습니다. 코스와 시간 안내를 먼저 받고 결정할 수 있어 좋았습니다." },
  { area: "인천 부평구", name: "장OO", text: "부평 지역 페이지에서 바로 전화했습니다. 후기와 FAQ를 보고 나니 처음 이용할 때 궁금한 점이 꽤 줄었습니다." },
  { area: "인천 중구", name: "서OO", text: "영종도 쪽 가능 여부가 궁금했는데 지역 구분이 되어 있어 찾기 편했습니다. 상담 후 방문 가능 시간을 확인했습니다." },
];

function shuffleReviews() {
  return [...reviews].sort(() => Math.random() - 0.5);
}

export function Reviews() {
  const items = useMemo(shuffleReviews, []);

  return <div className="review-grid">{items.map((review, index) => <article className="review-card" key={`${review.area}-${review.name}-${index}`}><div className="review-top"><span className="stars">★★★★★</span><span>{review.area}</span></div><p>{review.text}</p><div className="review-foot"><strong>{review.name}</strong><a href={site.tel}>전화예약</a></div></article>)}</div>;
}
