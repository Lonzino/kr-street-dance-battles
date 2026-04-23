# TODO

남은 작업 우선순위 정리. 마지막 갱신: **2026-04-23 (Phase 0~3 + 보안 보강 + 운영 매뉴얼 완료)**.

상태 표기: ⏳ 대기 · 🔄 진행중 · ✅ 완료 · ❌ 보류

> **📋 코드 리뷰**: [REVIEW-FIXES.md](./REVIEW-FIXES.md) (초기 스냅샷) → [SECURITY-REVIEW.md](./SECURITY-REVIEW.md) (인증 감사, 최신)
> **📖 운영 매뉴얼**: [OPERATIONS.md](./OPERATIONS.md) · [SECRETS.md](./SECRETS.md) · [ACTIVATION.md](./ACTIVATION.md)

---

## ✅ 아카이브 — 배포 차단 해소 (2026-04-23 완료)

```
38f0357  feat(auth):   Phase 0 — Supabase Auth (Kakao + Google)
9774a0f  feat(p1):     북마크·알림·iCal·일일 메일
e66c1d3  feat(p2):     셀프 등록·편집·포스터 업로드
e7428f1  feat(p3):     랭킹·후원·크루 클레임
0283d03  feat(보안):   rate limit + 약관/개인정보 + 회원 탈퇴
cf790be  docs:         운영 매뉴얼 + 시크릿 관리
```

### Critical (C1~C7) — 전부 ✅

| # | 작업 | 상태 |
|---|------|------|
| C1 | Supabase 프로젝트 생성 | ✅ |
| C2 | `.env.local` 시크릿 구성 | ✅ |
| C3 | `db:push` 스키마 적용 | ✅ |
| C4 | `seed` JSON→DB 마이그레이션 | ✅ |
| C5 | admin 로그인 + 검토 큐 E2E | ✅ |
| C6 | Vercel 배포 + 환경변수 | ✅ |
| C7 | 도메인 연결 | ⏳ (선택) |

---

## 🔥 Critical 현재 — 없음 (배포 전 블로커 해소)

새 Critical이 발견되면 [SECURITY-REVIEW.md](./SECURITY-REVIEW.md) 이슈 트래킹.

---

## ⭐ High — 초기 사용자 흐름 보강

### 데이터 확충 ⏳
- [ ] 2026 상반기 주요 배틀 **50건 이상** 백필 (R16·BBIC·BOTY KR·JBGP 시즌 등)
- [ ] 주요 크루 **30곳 이상** (지역별 균형)
- [ ] 과거 배틀 아카이브 (2020~2025 우승 결과)

### UX
- [x] 필터링 UI (장르/지역/상태 칩) ✅
- [x] 크루 상세 + 배틀↔크루 상호 링크 ✅
- [x] 검색 (Postgres `tsvector`) ✅ `bbabd58`
- [x] og:image 동적 생성 ✅
- [x] sitemap / robots / JSON-LD DanceEvent ✅
- [x] 404 / error / loading 페이지 ✅
- [x] 포스터 이미지 업로드 (Supabase Storage) ✅ `e66c1d3`
- [ ] 모바일 최적화 실제 폰 검수

### 신뢰성
- [x] 이미지·텍스트 데이터 출처 표기 (DB source_url) ✅
- [x] 수정 이력 (`updated_at` + edit_log 테이블) ✅ `e66c1d3`

---

## 🔧 Medium — 자동화·확장

### 수집 자동화
- [x] Discord 봇 (`#배틀제보` → `/api/ingest`) ✅ `4602978`
- [x] Vercel Cron 매일 상태 갱신 ✅ `4602978`
- [x] GitHub Issue → ingest 브릿지 ✅ `6cbec87`
- [ ] 인스타 Graph API (공식 oEmbed)
- [ ] YouTube Data API (결과 영상 자동 매칭)
- [ ] 공식 사이트 어댑터 (KDO/BBIC/R16 등)
- [ ] 포스터 OCR (Claude Vision)
- [ ] 중복 감지 (fuzzy match, ≥80%)

### Admin 강화
- [x] 운영자 다중 계정 (Supabase Auth 전환) ✅ `38f0357`
- [x] 편집 폼 (필드별 입력) ✅ `e66c1d3`
- [x] 활동 로그 (edit_log 테이블) ✅ `e66c1d3`
- [ ] 일괄 처리 (여러 record 선택 승인/거부)
- [ ] 수정 후 재파싱 (LLM 재실행)

### 데이터 모델
- [ ] `dancers` 테이블 (심사위원/우승자 프로필)
- [x] crew ↔ battle FK (join 테이블 `battle_results`) — **일부 해결**, alias 매칭으로 보강 `bbabd58`
- [ ] 태그 정규화 (enum/다대다)
- [ ] 이벤트 시리즈 (같은 대회 여러 시즌 묶기)

---

## 💡 Low — 있으면 좋음

- [x] iCal 피드 (`/calendar.ics`) ✅ `9774a0f`
- [x] 뉴스레터 (일일 메일) ✅ `9774a0f`
- [x] 랭킹 (`/ranking`) ✅ `e7428f1`
- [ ] 지도 뷰 (Mapbox/Naver Map)
- [ ] 캘린더 뷰 (월별/주별 그리드)
- [ ] 댓글/토론 (Giscus)
- [ ] RSS (`/feed.xml`)
- [ ] 다크/라이트 토글 (현재 다크 고정)
- [ ] 모션 (Framer Motion)
- [ ] i18n (영문 버전)

### 커뮤니티
- [x] 공개 제보 폼 (`/submit` Phase 2) ✅ `e66c1d3`
- [ ] SNS 공유 버튼 (X/Threads/Instagram Story)
- [ ] 운영자 블로그 (MDX)
- [ ] 연간 결산 페이지

---

## 🛡️ 보안 / 운영

- [x] Rate limiting — `/admin/login` + `/api/ingest` ✅ `447aba3` + `0283d03`
- [x] 약관 (`/terms`) + 개인정보처리방침 (`/privacy`) ✅ `0283d03`
- [x] 회원 탈퇴 + 데이터 anonymize ✅ `0283d03`
- [x] 운영 매뉴얼 + 시크릿 관리 가이드 ✅ `cf790be`
- [ ] 에러 모니터링 (Sentry 무료)
- [ ] 업타임 모니터링 (Better Stack / UptimeRobot)
- [ ] DB 백업 정책 (Supabase auto + 주간 수동 export)
- [ ] 로그 수집 (Vercel Logs / Axiom)
- [ ] `/admin/login` IP 화이트리스트 (선택)
- [ ] 2FA (선택, 본인만 쓰면 불요)

---

## 🧪 CI / 코드 품질

- [x] Biome 린터·포매터 ✅
- [x] CI: lint + validate-data + build ✅
- [x] Husky + commitlint + lint-staged ✅ `87be085`
- [x] Dependabot (주간 업데이트) ✅ `87be085`
- [x] CODEOWNERS ✅ `87be085`
- [x] release-please 자동 릴리스 ✅ `d45a0d2`
- [ ] PR Preview 배포 검증 (Vercel 자동, 한 번 확인)
- [ ] 단위 테스트 (`lib/labels.ts` 등 순수 함수, vitest)
- [ ] E2E (Playwright, 로그인 → 큐 → 승인 플로우)

---

## 📜 법적 / 라이선스

- [x] 개인정보처리방침 (`/privacy`) ✅
- [x] 서비스 이용약관 (`/terms`) ✅
- [ ] 데이터 라이선스 재확인 (주최자 동의 확보)
- [ ] 이미지 저작권 정책 (출처 표기 + 요청 시 삭제)
- [ ] 인스타 사용 가이드 (공식 oEmbed만, 스크래핑 금지 코드 주석)

---

## 의사결정 해결됨

| 주제 | 결정 |
|------|------|
| 인증 확장 | **Supabase Auth** (Kakao + Google) `38f0357` |
| 결제 | **비-결제 후원** (Buy Me a Coffee + Toss) `e7428f1` |
| 포스터 호스팅 | **Supabase Storage** `e66c1d3` |

### 여전히 대기

| 주제 | 옵션 | 결정 필요 시점 |
|------|------|----------------|
| 모바일 앱 | PWA vs React Native vs 안 함 | DAU 100 도달 시 |
| 다국어 | ko 단일 vs ko+en | 외국 댄서 유입 시 |

---

## 다음 30일 추천 순서 (배포 후)

1. **Week 1**: 데이터 백필 30~50건 + 실제 폰 검수 + Vercel Preview 확인
2. **Week 2**: Sentry + UptimeRobot + DB 백업 자동화
3. **Week 3**: 인스타 Graph API 또는 공식 사이트 어댑터 1개
4. **Week 4**: 단위 테스트 기반 + dancers 테이블 + 첫 사용자 10명 모집

---

## 변경 이력

- **2026-04-23**: 초안 작성 (스캐폴드 + 자동화 루프)
- **2026-04-23**: Round 1~4 (필터/크루상세/SEO/Biome/Discord봇/Cron)
- **2026-04-23**: G1~G7 (인증·인젝션 방어·스키마·FK·검색·alias)
- **2026-04-23**: Phase 0~3 (Supabase Auth·댄서 루프·주최자 루프·랭킹/후원/클레임)
- **2026-04-23**: 배포 차단 보안 해소 (rate limit / 약관 / 회원 탈퇴)
- **2026-04-23**: 기여 인프라 Tier 1~4 (Issue/PR 템플릿·Husky·release-please·Issue→ingest)
- **2026-04-23**: 운영 매뉴얼 + 시크릿 관리 + **이 TODO drift 해소**
