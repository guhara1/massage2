# 색인(인덱싱) 자동화 도구

새 글/지역 페이지를 올릴 때마다 검색엔진에 **즉시 색인 통보**하기 위한 도구 모음입니다.

| 검색엔진 | 통보 방식 | 도구 |
| --- | --- | --- |
| Bing / Naver / Yandex / Seznam | IndexNow (1회 제출로 전체 전파) | `indexnow.py` |
| Google | Indexing API (IndexNow 미참여) | `google_indexing.py` (선택) |

도메인: `https://massagepick1.netlify.app`
IndexNow 키: `1c04621791f9ea2e13ce07cb47b1b193`
키 파일: `https://massagepick1.netlify.app/1c04621791f9ea2e13ce07cb47b1b193.txt` (빌드 시 자동 생성)

---

## 1. IndexNow (Bing·Naver·Yandex) — 설치 불필요

표준 라이브러리만 사용하므로 Python 3 만 있으면 됩니다.

```bash
# 최초 1회 일괄 통보 — sitemap.xml 의 모든 URL을 즉시 통보
python tools/indexnow.py

# 글 올릴 때마다 특정 URL만 통보 (여러 개 가능)
python tools/indexnow.py https://massagepick1.netlify.app/area/서울/강남구/

# 배포 직후 로컬 out/sitemap.xml 로 통보 (CI 등)
python tools/indexnow.py --sitemap out/sitemap.xml

# 제출 없이 대상 URL만 확인
python tools/indexnow.py --dry-run
```

> 키 파일은 `npm run build` 시 `out/` 루트에 자동 생성되어 배포됩니다.
> IndexNow 통보 전에 해당 페이지가 **라이브 상태**여야 합니다(키 검증 때문).

## 2. Google Indexing API (선택)

구글은 IndexNow에 참여하지 않으므로 즉시 통보가 필요하면 Indexing API를 사용합니다.

```bash
pip install -r tools/requirements.txt
```

사전 준비:
1. Google Cloud 프로젝트에서 **Indexing API** 활성화
2. 서비스 계정 생성 → JSON 키 다운로드
3. [Search Console](https://search.google.com/search-console) → 설정 → 사용자 및 권한 에서
   서비스 계정 이메일(`...@....iam.gserviceaccount.com`)을 **소유자**로 추가
4. 실행:
   ```bash
   GOOGLE_SA_JSON=key.json python tools/google_indexing.py
   ```

## 3. 자동화 (글 올릴 때마다 자동 통보)

`.github/workflows/indexnow.yml` 이 `main` 브랜치 푸시마다 자동 실행됩니다.
Netlify 배포(약 3분 대기) 후 sitemap 전체를 IndexNow로 통보합니다.

- **Google 자동화도 켜려면**: 저장소 Secrets 에 `GOOGLE_SA_JSON`
  (서비스 계정 JSON 전체 내용)을 등록하면 워크플로가 자동으로 Google에도 통보합니다.

## 4. 색인 가속 체크리스트 (수동, 1회)

가장 빠른 색인을 위해 검색엔진 콘솔에 사이트맵을 직접 등록하세요.

- **Naver 서치어드바이저** (https://searchadvisor.naver.com)
  - 사이트 등록 → 소유 확인 (메타태그 `5e958e401239b94496adc712e9a4812b8df9b491` 자동 삽입됨)
  - 요청 → 사이트맵 제출: `https://massagepick1.netlify.app/sitemap.xml`
  - 요청 → RSS 제출: `https://massagepick1.netlify.app/rss.xml`
  - 웹 페이지 수집 요청으로 핵심 URL 직접 제출
- **Google Search Console** (https://search.google.com/search-console)
  - 소유 확인(메타태그 자동 삽입) → Sitemaps 에 `sitemap.xml` 제출
  - URL 검사 → 색인 생성 요청
- **Bing Webmaster Tools** (https://www.bing.com/webmasters)
  - 사이트맵 제출 + IndexNow 키 자동 인식

> 참고: Google·Bing 의 sitemap **ping 엔드포인트는 2023년 폐지**되어 더 이상 동작하지 않습니다.
> 따라서 즉시 색인은 IndexNow + Indexing API + 콘솔 사이트맵 등록 조합이 가장 빠릅니다.
