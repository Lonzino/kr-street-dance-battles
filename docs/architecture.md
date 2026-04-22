# Architecture

## 데이터 흐름

```
[수집]              [파싱]             [검토]            [공개]
                                                          │
URL or text  ──→  source_records  ──→  /admin/queue  ──→  battles
              fetch  raw            LLM  parsed         사람  validated  →  published
```

각 단계가 별개 상태:

| 상태 | 누가 채움 | 의미 |
|------|----------|------|
| `raw` | 크롤러 (자동) | 원본 텍스트·이미지 그대로 |
| `parsed` | LLM (Claude API) | 구조화된 Battle 후보 + confidence |
| `validated` | 사람 (admin UI) | 사실 확인 + 수정 완료 |
| `published` | 시스템 | 공개 사이트 노출 |
| `rejected` | 사람 | 검토 후 폐기 |
| `duplicate` | 자동/사람 | 기존 record와 중복 |

## 디렉토리

```
src/
├── app/                # Next.js 라우트
│   ├── (public)        # 공개 페이지
│   │   ├── page.tsx
│   │   ├── battles/[slug]/page.tsx
│   │   ├── crews/page.tsx
│   │   └── about/page.tsx
│   └── admin/          # 운영 패널 (인증 필요)
│       ├── queue/      # 검토 큐
│       └── battles/    # DB의 모든 배틀
│
├── schema/             # ★ Zod 스키마 (단일 진실)
│   ├── enums.ts        # DanceGenre, Region, BattleStatus 등
│   ├── battle.ts
│   ├── crew.ts
│   └── source.ts
│
├── db/                 # Drizzle ORM
│   ├── schema.ts       # PostgreSQL 테이블 정의
│   └── client.ts       # 연결 + 풀링
│
├── ingestion/          # 데이터 수집
│   ├── sources/        # 어댑터 (Instagram, Manual, ...)
│   ├── parsers/        # LLM 추출
│   └── pipeline.ts     # 통합 흐름
│
├── components/         # UI 컴포넌트
├── lib/                # 헬퍼 (라벨, 데이터 액세스)
└── data/               # JSON 시드 (DB 마이그레이션 후엔 백업용)

scripts/
├── validate-data.ts    # CI: JSON ↔ Zod 스키마 검증
├── seed.ts             # JSON → DB
└── ingest-url.ts       # CLI 수집 도구

drizzle/                # 자동 생성된 마이그레이션 SQL
```

## 단일 진실: Zod 스키마

`src/schema/`가 모든 곳의 타입 진실의 원천:

- **Frontend**: `import { Battle } from "@/schema"` — 컴포넌트 props 타입
- **DB layer**: Drizzle 스키마는 별도지만 검증은 Zod로
- **Ingestion**: LLM 출력을 `Battle.partial().parse()`로 검증
- **CI**: `scripts/validate-data.ts`가 JSON 무결성 검사
- **API**: 추후 추가될 REST/RPC 엔드포인트의 입력 검증

타입 한 줄 바꾸면 빌드가 모든 사용처에서 에러로 잡아줌.

## Idempotent 수집

`source_records`의 `(source_type, source_id)` 유니크 제약 + UPSERT.
같은 인스타 포스트 1000번 크롤해도 row 1개만 유지, `raw_content`만 덮어씀.

## 보안 / 인증

**현재 상태: admin 인증 미구현.** 배포 전 반드시:

| 옵션 | 난이도 | 추천 |
|------|--------|------|
| Supabase Auth (이메일 매직링크) | 낮음 | ★ 1인 운영 |
| Clerk middleware | 매우 낮음 | 무료티어 충분 |
| Edge middleware + 비밀번호 | 매우 낮음 | 임시방편 |

`/admin/*` 라우트를 미들웨어에서 차단.

## 배포 (계획)

| 컴포넌트 | 호스트 | 비용 |
|---------|--------|------|
| 웹앱 (Next.js) | Vercel | 무료 |
| DB (Postgres) | Supabase | 무료 (500MB) |
| LLM 호출 | Anthropic API | 인스타 1건 ≈ $0.001 |
| 백그라운드 잡 | Vercel Cron 또는 Inngest | 무료티어 |
| 이미지 (포스터) | Supabase Storage 또는 R2 | 무료티어 |

## 다음 마일스톤

1. ⏳ Supabase 프로젝트 생성 + DATABASE_URL 설정
2. ⏳ `npm run db:push` (스키마 적용)
3. ⏳ `npm run seed` (현재 JSON 마이그레이션)
4. ⏳ admin 인증 미들웨어
5. ⏳ /admin/queue server actions (승인/거부 버튼)
6. ⏳ Vercel 배포
7. ⏳ Discord 봇 (제보 채널 → 자동 ingest)
