#!/usr/bin/env python3
"""Google Indexing API 즉시 색인 통보 (선택 사항).

구글은 IndexNow에 참여하지 않으므로, 즉시 통보가 필요하면 Indexing API를 사용합니다.
서비스 계정 인증이 필요하므로 google-auth 패키지가 필요합니다:

    pip install -r tools/requirements.txt

사전 준비:
  1) Google Cloud 프로젝트에서 "Indexing API" 활성화
  2) 서비스 계정 생성 → JSON 키 다운로드
  3) Search Console > 설정 > 사용자 및 권한 에서
     서비스 계정 이메일(...@...iam.gserviceaccount.com)을 '소유자'로 추가
  4) 환경변수로 키 경로 지정:  export GOOGLE_SA_JSON=/path/service-account.json

사용법:
  # sitemap 전체 통보 (라이브 sitemap.xml 기준)
  GOOGLE_SA_JSON=key.json python tools/google_indexing.py

  # 특정 URL만 통보
  GOOGLE_SA_JSON=key.json python tools/google_indexing.py https://massagepick1.netlify.app/area/서울/강남구/

참고: Indexing API는 공식적으로 JobPosting/BroadcastEvent 대상이지만,
일반 페이지에도 크롤 요청 신호로 활용됩니다. 일일 할당량(기본 200건/일)에 유의하세요.
"""

from __future__ import annotations

import os
import re
import sys
import json
import urllib.request

HOST = "massagepick1.netlify.app"
SITEMAP_URL = f"https://{HOST}/sitemap.xml"
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
SCOPES = ["https://www.googleapis.com/auth/indexing"]
USER_AGENT = "massagepick-google-indexing/1.0"


def parse_locs_from_sitemap() -> list[str]:
    req = urllib.request.Request(SITEMAP_URL, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        xml = resp.read().decode("utf-8", "replace")
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)
    seen: set[str] = set()
    out: list[str] = []
    for u in locs:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def get_session():
    try:
        from google.oauth2 import service_account
        import google.auth.transport.requests
    except ImportError:
        sys.exit(
            "google-auth 패키지가 필요합니다.  pip install -r tools/requirements.txt"
        )

    sa_path = os.environ.get("GOOGLE_SA_JSON")
    if not sa_path or not os.path.exists(sa_path):
        sys.exit("환경변수 GOOGLE_SA_JSON 에 서비스 계정 JSON 경로를 지정하세요.")

    creds = service_account.Credentials.from_service_account_file(sa_path, scopes=SCOPES)
    creds.refresh(google.auth.transport.requests.Request())
    return creds.token


def notify(token: str, url: str) -> bool:
    payload = json.dumps({"url": url, "type": "URL_UPDATED"}).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            ok = resp.getcode() == 200
        print(f"  {'✓' if ok else '✗'} {url}")
        return ok
    except Exception as e:  # noqa: BLE001
        print(f"  ✗ {url} — {e}")
        return False


def main() -> int:
    urls = sys.argv[1:] or parse_locs_from_sitemap()
    urls = [u for u in urls if u.startswith(f"https://{HOST}")]
    if not urls:
        print("통보할 URL이 없습니다.", file=sys.stderr)
        return 1

    token = get_session()
    print(f"Google Indexing API — {len(urls)}개 URL 통보")
    ok = all(notify(token, u) for u in urls)
    print("완료" if ok else "일부 실패")
    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
