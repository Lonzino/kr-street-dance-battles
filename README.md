# KR Street Dance Battles

한국 스트릿 댄스 배틀 정보 커뮤니티 아카이브.

비보잉 · 팝핑 · 락킹 · 왁킹 · 힙합 · 하우스 · 크럼프 등 국내에서 열리는 스트릿 댄스 배틀의 일정 / 결과 / 크루 정보를 한 곳에 모으는 프로젝트.

## 기능

- 전국 스트릿 댄스 배틀 일정 (접수중 · 예정 · 종료 아카이브)
- 배틀 상세 (장소 · 주최 · 심사위원 · 상금 · 결과)
- 크루 디렉토리
- LLM 기반 자동 데이터 수집 + 휴먼 검토 큐 (`/admin`)

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript** + **Tailwind CSS v4**
- **Zod** (단일 진실 스키마)
- **Drizzle ORM** + **PostgreSQL** (Supabase)
- **Anthropic Claude** (LLM 추출)

## 개발 (DB 없이)

```bash
npm install
npm run dev          # http://localhost:3000
npm run validate-data  # JSON ↔ Zod 검증
```

이 상태로 정적 데이터(`src/data/*.json`) 기반 사이트가 동작.

## 자동화 활성화

자세한 설정: [docs/setup.md](./docs/setup.md)

```bash
cp .env.example .env.local
# DATABASE_URL + ANTHROPIC_API_KEY 채우기

npm run db:push      # Supabase에 스키마 적용
npm run seed         # JSON 데이터 → DB 마이그레이션

# 인스타 URL 또는 텍스트로 자동 수집 → 검토 큐
npm run ingest:url -- "https://www.instagram.com/p/XXXX"
```

검토는 http://localhost:3000/admin/queue 에서.

## 구조

```
src/
├── app/                # Next.js 라우트
│   ├── (public)        # 홈, /battles/[slug], /crews, /about
│   └── admin/          # 관리자 (인증 미구현 — 배포 전 필수)
├── schema/             # ★ Zod 단일 진실 (DB·Frontend·Ingestion 공유)
├── db/                 # Drizzle ORM
├── ingestion/          # 데이터 수집
│   ├── sources/        # Instagram, Manual 어댑터
│   ├── parsers/        # LLM 추출 (Claude API)
│   └── pipeline.ts
├── components/
├── lib/
└── data/               # JSON 시드 (DB 백업용)

scripts/
├── validate-data.ts    # CI: 무결성 검증
├── seed.ts             # JSON → DB
└── ingest-url.ts       # CLI 수집

docs/
├── architecture.md     # 데이터 흐름 + 디렉토리
├── setup.md            # Supabase + LLM 활성화
└── data-sources.md     # 합법적 수집 전략
```

## 배틀 정보 제보 / 수정

- **GitHub Issue**: [이슈로 제보](https://github.com/Lonzino/kr-street-dance-battles/issues)
- **Pull Request**: `src/data/battles.json` / `src/data/crews.json` 수정 → PR
  - CI가 Zod 스키마로 자동 검증

### 데이터 스키마

런타임 검증되는 단일 진실: [`src/schema/battle.ts`](./src/schema/battle.ts), [`src/schema/crew.ts`](./src/schema/crew.ts)

## 로드맵

- [x] MVP: JSON 기반 사이트
- [x] Zod 스키마 + Drizzle DB 레이어 (pgEnum, FK)
- [x] LLM 수집 + 검토 큐 + 승인 액션 (자동화 루프 완성)
- [x] Admin 인증 (Edge JWT + 비밀번호 + rate limit)
- [x] 공개 사이트 DB 전환 (admin 승인 즉시 반영)
- [x] 필터링 UI (장르 / 지역 / 상태)
- [x] 크루 상세 페이지 + 배틀↔크루 링크
- [x] SEO 풀세트 (sitemap, robots, og:image, JSON-LD)
- [x] Discord 봇 + Vercel Cron (자동 상태 갱신)
- [ ] Vercel 배포 + Supabase 연결
- [ ] 본인 인스타 계정 자동 polling (Graph API)
- [ ] 풀텍스트 검색

상세 진행: [docs/TODO.md](./docs/TODO.md), [docs/REVIEW-FIXES.md](./docs/REVIEW-FIXES.md)

## 라이선스

데이터(`src/data/*.json`) CC0 · 코드 MIT
