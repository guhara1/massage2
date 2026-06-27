#!/usr/bin/env python3
"""IndexNow 즉시 색인 통보 스크립트 (Bing / Naver / Yandex / Seznam).

표준 라이브러리만 사용하므로 별도 설치(pip)가 필요 없습니다.

사용법:
  # 1) 전체 일괄 통보 — 라이브 sitemap.xml 의 모든 URL을 즉시 통보
  python tools/indexnow.py

  # 2) 글 올릴 때마다 특정 URL만 즉시 통보 (여러 개 가능)
  python tools/indexnow.py https://massagepick1.netlify.app/area/서울/강남구/

  # 3) 로컬 out/sitemap.xml 에서 URL을 읽어 통보 (배포 직후 CI 등)
  python tools/indexnow.py --sitemap out/sitemap.xml

IndexNow 한 번 제출이면 참여 검색엔진(Bing·Naver·Yandex·Seznam)에 동시에 전달됩니다.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
import urllib.error

# ──────────────────────────────────────────────────────────────────────────
# 설정 — 도메인/키만 바꾸면 됩니다.
HOST = "massagepick1.netlify.app"
KEY = "1c04621791f9ea2e13ce07cb47b1b193"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP_URL = f"https://{HOST}/sitemap.xml"

# IndexNow 게이트웨이 (제출 1회 → 모든 참여 엔진에 전파)
ENDPOINT = "https://api.indexnow.org/indexnow"
USER_AGENT = "massagepick-indexnow/1.0 (+https://massagepick1.netlify.app)"
BATCH_SIZE = 10000  # IndexNow 1회 제출 최대 URL 수
TIMEOUT = 30
# ──────────────────────────────────────────────────────────────────────────


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        return resp.read().decode("utf-8", "replace")


def read_local(path: str) -> str:
    with open(path, "r", encoding="utf-8") as fh:
        return fh.read()


def parse_locs(xml: str) -> list[str]:
    """sitemap.xml 의 <loc> 값을 모두 추출."""
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)
    # 중복 제거 + 입력 순서 유지
    seen: set[str] = set()
    out: list[str] = []
    for u in locs:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def chunked(items: list[str], size: int):
    for i in range(0, len(items), size):
        yield items[i : i + size]


def submit(urls: list[str]) -> bool:
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            code = resp.getcode()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:300]
        print(f"  ✗ HTTP {e.code}: {body}")
        return False
    except urllib.error.URLError as e:
        print(f"  ✗ 네트워크 오류: {e.reason}")
        return False

    # 200 OK, 202 Accepted 모두 정상 (202 = 접수됨)
    if code in (200, 202):
        print(f"  ✓ HTTP {code} — {len(urls)}개 URL 통보 완료")
        return True
    print(f"  ✗ 예상치 못한 응답 코드: {code}")
    return False


def collect_urls(args) -> list[str]:
    if args.urls:
        return args.urls
    if args.sitemap:
        print(f"로컬 사이트맵 읽는 중: {args.sitemap}")
        return parse_locs(read_local(args.sitemap))
    print(f"라이브 사이트맵 가져오는 중: {SITEMAP_URL}")
    return parse_locs(fetch(SITEMAP_URL))


def main() -> int:
    parser = argparse.ArgumentParser(description="IndexNow 즉시 색인 통보")
    parser.add_argument("urls", nargs="*", help="통보할 URL (생략 시 sitemap 전체)")
    parser.add_argument("--sitemap", help="로컬 sitemap.xml 경로 (예: out/sitemap.xml)")
    parser.add_argument("--dry-run", action="store_true", help="제출 없이 URL만 출력")
    args = parser.parse_args()

    try:
        urls = collect_urls(args)
    except Exception as e:  # noqa: BLE001
        print(f"URL 수집 실패: {e}", file=sys.stderr)
        return 1

    # 같은 호스트만 통보 (IndexNow 규칙)
    urls = [u for u in urls if u.startswith(f"https://{HOST}") or u.startswith(f"http://{HOST}")]
    if not urls:
        print("통보할 URL이 없습니다.", file=sys.stderr)
        return 1

    print(f"대상 URL: {len(urls)}개  (host={HOST})")
    if args.dry_run:
        for u in urls:
            print(f"  - {u}")
        return 0

    ok = True
    for batch in chunked(urls, BATCH_SIZE):
        ok = submit(batch) and ok

    if ok:
        print("\n완료: 모든 URL이 IndexNow(Bing·Naver·Yandex)에 통보되었습니다.")
        return 0
    print("\n일부 제출이 실패했습니다. 위 로그를 확인하세요.", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
