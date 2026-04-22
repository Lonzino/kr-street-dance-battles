# TODO

남은 작업 우선순위 정리. 마지막 갱신: 2026-04-23.

상태 표기: ⏳ 대기 · 🔄 진행중 · ✅ 완료 · ❌ 보류

---

## 🔥 Critical — 배포 전 반드시

| # | 작업 | 누가 | 예상 시간 |
|---|------|------|-----------|
| C1 | Supabase 프로젝트 생성 (region: Northeast Asia / Seoul) | 본인 | 5분 |
| C2 | `.env.local` 작성 — `DATABASE_URL`, `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, `JWT_SECRET` | 본인 | 5분 |
| C3 | `npm run db:push` — Supabase에 스키마 적용 | 본인 | 10초 |
| C4 | `npm run seed` — 현재 JSON → DB 마이그레이션 | 본인 | 10초 |
| C5 | 로컬에서 admin 로그인 + 검토 큐 흐름 한 번 테스트 | 본인 | 5분 |
| C6 | Vercel 프로젝트 연결 + 환경변수 4개 등록 + 첫 배포 | 본인 | 15분 |
| C7 | 도메인 연결 (선택, Vercel 기본 도메인으로 시작 가능) | 본인 | 30분 |

상세는 [setup.md](./setup.md).

---

## ⭐ High — 초기 사용자에게 중요

### 데이터 확충
- [ ] 2026 상반기 주요 배틀 50건 이상 백필 (R16, BBIC, BOTY KR, JBGP 시즌 등)
- [ ] 주요 크루 30곳 이상 (지역별 균형)
- [ ] 과거 배틀 아카이브 (2020~2025 우승 결과)

### UX 기본기
- [x] **필터링 UI** — 장르/지역/상태 칩 (URL 쿼리, JS 없이) ✅ 2026-04-23
- [x] **크루 상세 페이지** — `/crews/[slug]` + 배틀↔크루 상호 링크 ✅ 2026-04-23
- [ ] **검색** — 제목/설명/태그 풀텍스트 (Postgres `tsvector` 또는 pg_trgm)
- [ ] **모바일 최적화 점검** — 실제 폰 화면에서 모든 페이지 검수
- [ ] **포스터 이미지 업로드** — Supabase Storage 또는 R2 연동
- [x] **og:image 동적 생성** — 사이트+배틀별 (한글 폰트는 추후) ✅ 2026-04-23
- [x] **sitemap.ts + robots.ts** — SEO 기본 ✅ 2026-04-23
- [x] **JSON-LD DanceEvent** — 구글 리치 결과 ✅ 2026-04-23
- [x] **404 / error.tsx 커스텀 페이지** ✅ 2026-04-23
- [x] **로딩 스켈레톤** — `loading.tsx` ✅ 2026-04-23

### 신뢰성
- [ ] **이미지·텍스트 데이터 출처 표기** — 각 배틀에 `source_url` 노출 (이미 DB엔 있음)
- [ ] **수정 이력** — `updated_at` 기준 "최근 업데이트" 표시

---

## 🔧 Medium — 자동화·확장

### 데이터 수집 자동화
- [x] **Discord 봇** — `#배틀제보` 채널 → `/api/ingest` (services/discord-bot/) ✅ 2026-04-23
- [x] **Vercel Cron** — 매일 자정 배틀 상태 자동 갱신 (`/api/cron/refresh-status`) ✅ 2026-04-23
- [ ] **본인 인스타 Graph API** — Vercel Cron으로 새 포스트 polling
- [ ] **YouTube Data API** — 결과 영상 자동 수집 (대회명 키워드)
- [ ] **공식 사이트 어댑터 추가** — KDO, BBIC, R16 등 정형화된 사이트
- [ ] **포스터 OCR** — 이미지 속 텍스트 → 배틀 정보 추출 (Claude Vision)
- [ ] **중복 감지** — fuzzy match (제목+날짜+장소 ≥80% → 병합 프롬프트)

### Admin 강화
- [ ] **편집 폼** — JSON 직접 편집 외에 필드별 입력 폼 (날짜 picker, region select)
- [ ] **일괄 처리** — 여러 record 선택 후 일괄 승인/거부
- [ ] **수정 후 재파싱** — LLM 결과 부족 시 추가 컨텍스트 + 재실행
- [ ] **활동 로그** — 누가 언제 무엇을 승인/수정했는지 기록 테이블
- [ ] **운영자 추가** — 단일 비밀번호 대신 사용자별 계정 (Supabase Auth로 전환)

### 데이터 모델 확장
- [ ] **dancers 테이블** — 댄서 프로필 (심사위원/우승자 연결)
- [ ] **crew ↔ battle 관계** — 결과를 텍스트가 아닌 FK로
- [ ] **태그 정규화** — 자유 태그 → 관리되는 enum/다대다
- [ ] **이벤트 시리즈** — 같은 대회 여러 시즌 묶기 (LINE UP, R16, BOTY 등)

---

## 💡 Low — 있으면 좋음

### 고급 기능
- [ ] **지도 뷰** — 배틀 위치 마커 (Mapbox/Naver Map)
- [ ] **캘린더 뷰** — 월별/주별 스케줄 그리드
- [ ] **랭킹** — 가장 많이 본 배틀, 인기 크루, 활동 지역 등
- [ ] **댓글/토론** — Giscus(GitHub Discussions 기반) 가벼운 옵션
- [ ] **뉴스레터** — 주간 배틀 다이제스트 (Resend / Buttondown)
- [ ] **RSS / iCal 피드** — `/feed.xml`, `/calendar.ics`
- [ ] **다크/라이트 모드 토글** — 현재 다크 고정
- [ ] **모션** — Framer Motion으로 페이지 전환·카드 호버
- [ ] **i18n** — 영문 버전 (외국 댄서 대상)

### 커뮤니티
- [ ] **공개 제보 폼** — 비로그인 사용자도 URL 제출 (rate limit 필수)
- [ ] **SNS 공유 버튼** — 배틀 상세 → X/Threads/Instagram Story
- [ ] **운영자 블로그** — 씬 기록·인터뷰 (MDX)
- [ ] **연간 결산 페이지** — 2026 베스트 배틀, 올해의 크루 등

---

## 🛡️ 보안 / 운영

- [ ] **Rate limiting** — `/api/admin/login` (brute force 방어), 공개 제보 폼
- [ ] **에러 모니터링** — Sentry 무료 plan
- [ ] **업타임 모니터링** — Better Stack 또는 UptimeRobot
- [ ] **DB 백업 정책** — Supabase 자동 백업 + 주간 수동 export 스크립트
- [ ] **로그 수집** — Vercel Logs 또는 Axiom
- [ ] **`/admin/login` IP 화이트리스트** (선택, 본인만 쓸 거면)
- [ ] **2FA** (옵션) — 단일 비번 대신 TOTP 추가

---

## 🧪 CI / 코드 품질

- [x] **Biome** — 린터+포매터 통합 (`npm run lint`, `lint:fix`, `format`) ✅ 2026-04-23
- [x] **CI에 lint + validate-data + build 통합** ✅ 2026-04-23
- [ ] **PR preview 배포** — Vercel이 자동 처리하지만 한 번 검증
- [ ] **단위 테스트** — `lib/labels.ts` 같은 순수 함수 (vitest)
- [ ] **E2E** — Playwright로 핵심 흐름 (로그인 → 큐 → 승인) 1~2개

---

## 📜 법적 / 라이선스

- [ ] **개인정보처리방침** — 사용자 데이터 수집 시작하면 필수
- [ ] **서비스 이용약관** — 제보 데이터 라이선스 명시
- [ ] **데이터 라이선스 재확인** — 현재 CC0로 README에 표기. 주최자 동의 받은 데이터인지 확인
- [ ] **이미지 저작권** — 포스터는 주최자 소유, 출처 표기 + 요청 시 삭제 정책
- [ ] **인스타 사용 가이드** — 공식 oEmbed/Graph API만 사용, 스크래핑 금지를 코드 주석에 명시

---

## 의사결정 대기 항목

| 주제 | 옵션 | 결정 필요 시점 |
|------|------|----------------|
| 인증 확장 | 단일 비번 유지 vs Clerk vs Supabase Auth | 운영자 2명 이상 늘릴 때 |
| 결제 | 무료 운영 vs 후원 (Buy me a coffee 등) vs 광고 | 트래픽 1k MAU 도달 시 |
| 포스터 호스팅 | Supabase Storage vs Cloudflare R2 vs Vercel Blob | 50개 이상 누적 시 |
| 모바일 앱 | PWA vs React Native vs 안 함 | DAU 100 도달 시 |

---

## 다음 30일 추천 순서

1. **Week 1**: C1~C7 (배포까지) + 로컬에서 ingest 한 번 성공
2. **Week 2**: 데이터 백필 30~50건, 필터링 UI
3. **Week 3**: Discord 봇 또는 공개 제보 폼
4. **Week 4**: 검색 + sitemap + og:image, 첫 사용자 모집

---

## 변경 이력

- 2026-04-23: 초안 작성 (스캐폴드 + 자동화 루프 완성 시점)
- 2026-04-23: Round 1~4 완료 (필터/크루상세/SEO/Biome/Discord봇/Cron)
