# 프로젝트 체크포인트

**일자**: 2026-04-23
**커밋**: `dfaa56b` (Phase A 완료 시점)
**저장소**: https://github.com/Lonzino/kr-street-dance-battles

이 문서는 **개발자(향후 본인 또는 협업자)·운영자 모두를 위한 단일 진실**입니다.
세부 문서로 들어가기 전에 이걸 먼저 읽으세요.

---

## 1. 프로젝트 정체성 (1분 요약)

**한국 스트릿 댄스 배틀 정보 + 참가 신청 + 댄서 디렉토리**.

목적: 댄스 씬 정보가 인스타에 분산된 문제를 한 사이트로 모음.
- **참가자**: 배틀 검색·북마크·알림·신청·결제(외부)·현장 체크인
- **주최자**: 배틀 등록·신청 관리·결과 입력·체크인 운영
- **운영자(본인)**: 데이터 큐레이션·자동 수집·모니터링

**수익 모델**: 현재 무료 + 후원. 트래픽 증가 후 주최자 피처드 리스팅 등 검토.

---

## 2. 현재 상태 한눈에

### 코드
- **34개 라우트** 빌드 통과 (lint·타입체크 OK)
- **5개 마이그레이션** (drizzle/0000~0004)
- **0건 배포 차단** 이슈

### 문서
| 문서 | 누구를 위해 |
|------|-----|
| `OPERATIONS.md` | 운영자 일상 매뉴얼 |
| `ACTIVATION.md` | 외부 서비스 셋업 12단계 |
| `SECRETS.md` | 시크릿 관리·회전 |
| `SECURITY-REVIEW.md` | 인증·보안 감사 |
| `TODO.md` | 우선순위 작업 목록 |
| `REVIEW-FIXES.md` | 초기 코드 리뷰 (역사) |
| `architecture.md` | 데이터 흐름 |
| `setup.md` | 로컬 셋업 |
| `data-sources.md` | 수집 전략 |
| **이 문서** | 전체 통합·개발 매뉴얼 |

### 외부 의존
| 서비스 | 사용 여부 | 비용 |
|--------|----------|------|
| GitHub | 코드 호스팅 | 무료 |
| Supabase | DB + Auth + Storage | 무료 (500MB) |
| Vercel | 호스팅 + Cron | 무료 (취미 plan) |
| Anthropic | LLM 자동 추출 (선택) | $0.001/건 |
| Resend | 이메일 알림 (선택) | 무료 (3000건/월) |
| Kakao Dev / Google Cloud | OAuth | 무료 |
| Railway / Fly.io | Discord 봇 호스팅 (선택) | $5~/월 |

---

## 3. 아키텍처 (개발자용)

```
┌─────────────────────────────────────────────────────────────────┐
│                         사용자 / 주최자                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Next.js 16 (App Router, Turbopack, Edge Proxy)                 │
│  ─────────────────────────────────────────────────────────────  │
│  • 공개 페이지 (RSC) — /, /battles/*, /crews/*, /dancers/*       │
│  • 인증 페이지 (RSC) — /login, /profile, /battles/*/register    │
│  • Admin 페이지 (RSC + Edge Proxy 보호) — /admin/*              │
│  • Server Actions — 모든 mutation                                │
│  • API Routes — /api/ingest, /api/cron/*, /api/upload/poster    │
└─────────────────────────────────────────────────────────────────┘
              │                    │                    │
       ┌──────┴───────┐   ┌────────┴────────┐  ┌────────┴────────┐
       ▼              ▼   ▼                 ▼  ▼                 ▼
  Supabase Auth  Drizzle ORM          Anthropic        외부 클라이언트
  (Kakao/Google) (Postgres)           Claude API      (Discord 봇 등)
       │              │                     │                 │
       ▼              ▼                     ▼                 ▼
   auth.users    public.* tables       LLM 추출        /api/ingest
                 (battles, crews,
                  registrations,
                  bookmarks, ...)
```

### 핵심 디렉토리

```
src/
├── app/                       # Next.js 16 App Router
│   ├── (public)               # 공개 라우트
│   │   ├── page.tsx           # 홈 (배틀 리스트)
│   │   ├── battles/[slug]/    # 배틀 상세·편집·신청·관리
│   │   ├── crews/             # 크루 디렉토리·상세·클레임
│   │   ├── dancers/           # 댄서 디렉토리·프로필 ★
│   │   ├── ranking/           # 크루 랭킹
│   │   ├── support/           # 후원
│   │   ├── privacy/, terms/   # 법적 페이지
│   │   ├── login/             # 사용자 OAuth 로그인
│   │   ├── profile/           # 프로필·북마크·알림·탈퇴
│   │   └── submit/battle/     # 셀프 등록
│   ├── admin/                 # 운영자 (proxy 보호)
│   │   ├── login/, queue/
│   │   ├── battles/           # 전체 배틀 관리
│   │   └── check-in/[token]/  # QR 체크인 ★
│   └── api/
│       ├── admin/logout/
│       ├── auth/logout/
│       ├── ingest/            # 외부 토큰 인증
│       ├── upload/poster/     # Supabase Storage
│       └── cron/              # Vercel Cron
├── components/                # UI 재사용 (BattleCard, BookmarkButton, ...)
├── db/                        # Drizzle 스키마 + 클라이언트
├── ingestion/                 # LLM 자동 수집 파이프라인
│   ├── sources/               # Instagram·Manual 어댑터
│   └── parsers/llm-extract.ts # Claude API 호출
├── lib/                       # 도메인 로직·헬퍼
│   ├── supabase/{server,client,middleware,admin,storage}.ts
│   ├── auth.ts                # admin JWT
│   ├── authz.ts               # 권한 단일 진실
│   ├── data.ts                # 배틀·크루 CRUD (DB 우선 + JSON fallback)
│   ├── bookmarks.ts, registrations.ts, categories.ts, dancers.ts
│   ├── notification-prefs.ts
│   ├── email/{client,templates}.ts
│   ├── check-in.ts            # HMAC QR 토큰
│   ├── rate-limit.ts          # 인메모리 best-effort
│   └── constants.ts, labels.ts, filters.ts
├── schema/                    # Zod 단일 진실
└── data/                      # JSON 시드 (DB 미연결 fallback)

drizzle/                       # 마이그레이션 SQL 5개
docs/                          # 본인 매뉴얼 (이 디렉토리)
scripts/                       # CLI: seed·ingest·new-battle·validate-data
services/discord-bot/          # 별도 호스팅용 봇
```

### 핵심 패턴

**1. 데이터 액세스는 항상 `lib/`를 거침**
```ts
// ❌ 페이지에서 직접 DB 호출
const battles = await db.select().from(schema.battles);

// ✅ lib/data.ts 사용 (JSON fallback 자동)
import { getAllBattles } from "@/lib/data";
const battles = await getAllBattles();
```

**2. Mutation은 항상 server action**
```ts
// 파일: src/app/foo/actions.ts
"use server";
export async function doSomething(input: unknown) {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };
  // Zod 검증
  // 권한 체크 (canEditBattle 등)
  // DB mutation
  // revalidatePath
}
```

**3. 권한은 항상 `lib/authz.ts` 사용**
```ts
const ctx = await loadAuthzContext(authUser.id);
if (!(await canEditBattle(ctx, battleId))) return { ok: false, error: "FORBIDDEN" };
```

**4. 외부 서비스 미설정 시 graceful fallback**
```ts
if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };
if (!isSupabaseConfigured()) return null;
// Resend는 dry-run, Anthropic은 throw
```

**5. 모든 enum은 `src/schema/enums.ts` + `src/db/schema.ts`에 1:1 매칭**

---

## 4. 개발 매뉴얼

### 새 기능 추가 워크플로

#### 새 페이지
1. `src/app/<path>/page.tsx` 생성
2. 데이터는 `lib/`에서 가져오기
3. mutation은 `actions.ts`에 (`"use server"`)
4. `npm run lint:fix` + `npm run build` 확인

#### 새 DB 테이블
1. `src/db/schema.ts`에 정의 (FK·index·enum 잊지 말기)
2. `src/schema/<entity>.ts`에 Zod 정의
3. `src/schema/index.ts`에 export 추가
4. `npm run db:generate -- --name=<설명>` (마이그레이션 생성)
5. 사람이 `drizzle/<NNNN>_<name>.sql` 검토
6. `npm run db:migrate` (로컬 DB)
7. `lib/<entity>.ts` 헬퍼 작성

#### 새 enum 값
1. `src/schema/enums.ts`에 추가
2. `src/db/schema.ts`의 pgEnum에도 추가
3. `lib/labels.ts`에 한글 라벨 추가
4. 마이그레이션 자동 생성 (Drizzle이 ALTER TYPE)

#### 새 권한
1. `src/lib/authz.ts`에 함수 추가
2. server action에서 호출
3. UI에서도 같은 함수로 버튼 노출 결정

### 코드 컨벤션

- **import 순서**: Biome가 자동 정렬 (외부 → @/ → 상대)
- **컴포넌트 파일명**: PascalCase (`BattleCard.tsx`)
- **server action 파일명**: `actions.ts`
- **client 컴포넌트 파일명**: `<feature>-form.tsx`, `<feature>-panel.tsx`
- **라우트 페이지**: `page.tsx` (서버), `<feature>-<role>.tsx` (클라)
- **CSS**: Tailwind 우선. `@apply` 안 씀.
- **에러 메시지**: 사용자 노출용은 한글, 코드 식별자는 SCREAMING_SNAKE (`UNAUTHENTICATED`)
- **주석**: 왜 그렇게 했는지만. 무엇을 했는지는 코드로.

### 흔한 함정

| 문제 | 원인 | 해결 |
|------|------|------|
| 빌드 시 "Cannot find module" | 마이그레이션 후 schema export 누락 | `src/schema/index.ts` export 추가 |
| Server action `void` 타입 에러 | useTransition에 Promise 반환 | `start(async () => { await ... })` |
| Drizzle row → Zod 타입 불일치 | rowToX 함수에서 변환 누락 | optional 필드는 `?? undefined` |
| Hot reload 후 DB 연결 끊김 | 매 요청마다 클라이언트 재생성 | `getDb()` 캐시 (이미 처리됨) |
| Supabase cookie 안 갱신 | proxy.ts에서 setAll 호출 안 함 | `updateSupabaseSession` 사용 |
| 체크인 토큰 위조 | HMAC 없이 random만 | `lib/check-in.ts`의 verify 사용 |

### 테스트 (현재 부재 — TODO)

```bash
# 수동 검증
npm run dev          # localhost:3001
npm run validate-data
npm run build        # 빌드·타입·lint
```

향후 도입:
- Vitest (`lib/labels.ts`, `lib/check-in.ts` 같은 순수 함수)
- Playwright (로그인 → 큐 → 승인 흐름)

---

## 5. 운영 매뉴얼 (요약)

상세는 [OPERATIONS.md](./OPERATIONS.md). 여기는 1분 요약.

### 매일
- `/admin/queue` 검토 (5분)

### 매주
- Anthropic 사용량 / Supabase DB Size / Vercel Analytics 확인

### 매월
- DB 백업 export, 시크릿 회전 검토

### 장애 대응 (요약)
- 사이트 다운 → Vercel Status + Logs
- DB 안 됨 → Supabase Status + DATABASE_URL
- LLM 비용 폭주 → INGEST_TOKEN 즉시 회전
- 시크릿 노출 → [SECRETS.md](./SECRETS.md) 회전 절차

### 자주 쓰는 명령어
```bash
npm run dev                        # 로컬 서버
npm run validate-data              # JSON ↔ Zod 검증
npm run db:push                    # 스키마 적용 (개발)
npm run db:migrate                 # 마이그레이션 적용 (프로덕션)
npm run seed                       # JSON → DB
npm run lint:fix                   # 자동 포맷
npm run build                      # 빌드·타입체크
npm run new:battle                 # 인터랙티브 배틀 등록
npm run ingest:url -- "<URL>"      # LLM 자동 추출
```

---

## 6. 결정 이력 (왜 이렇게 만들었는지)

| 결정 | 이유 |
|------|------|
| Next.js 16 App Router | 서버 컴포넌트 + Server Actions로 단순한 mutation |
| Supabase | DB + Auth + Storage 통합. 무료티어 충분 |
| Drizzle ORM | TypeScript-first, Prisma보다 가벼움, raw SQL 가능 |
| Zod 단일 진실 | DB·Frontend·Ingestion 모두 한 곳에서 검증 |
| OAuth만 (비밀번호 X) | 비밀번호 관리 비용 0, 인증 위탁 |
| Admin JWT 별도 | 1인 운영 단순화. 다중 운영자 시 Supabase Auth로 전환 |
| 결제 외부 | 사업자 등록·PG 수수료 회피, MVP 빠른 출시 |
| QR 토큰 = HMAC | 위·변조 방지, DB 조회 1번으로 검증 |
| 프롬프트 인젝션 방어 | XML 태그 + 패턴 감지 + confidence cap |
| 인메모리 rate limit | Vercel 무료티어. 트래픽 증가 시 Upstash로 |
| JSON fallback | DB 없이도 사이트 동작 (개발·장애 대비) |

---

## 7. 다음 단계 옵션 (선택)

### A. 배포 (가장 즉시 — 1시간)
1. Supabase 가입 + 프로젝트 → [ACTIVATION.md](./ACTIVATION.md) 따라하기
2. Kakao + Google OAuth → 가이드 동일
3. Vercel 연결 + 배포

### B. 데이터 채우기 (가장 가치 — 1주)
- 본인이 알고 있는 배틀 50건 백필
- 인스타에서 자동 수집 (Anthropic API 활성화)
- 최소 사용자 10명 모집

### C. 자동화 강화 (1개월)
- Discord 봇 Railway 배포
- 인스타 Graph API (본인 계정 polling)
- YouTube Data API (결과 영상 자동)

### D. 모니터링 (배포 후 1주 이내)
- Sentry (에러)
- Better Stack / UptimeRobot (업타임)
- DB 자동 백업 검증

### E. 새 기능 (사용자 피드백 기반)
- 일괄 처리 (admin queue)
- LLM 재파싱
- dancers 자동 생성 (결과에서)
- 이벤트 시리즈 (LINE UP 시즌별 묶기)
- 댓글 / SNS 공유

상세 우선순위는 [TODO.md](./TODO.md).

---

## 8. 자동화 한계 (정직)

본인이 직접 해야만 하는 작업:
- ❌ Supabase 계정 가입 (이메일 인증)
- ❌ Supabase 프로젝트 생성 (region·비번 입력)
- ❌ Kakao Developers 앱 등록
- ❌ Google Cloud OAuth client 생성
- ❌ Vercel 계정 + 프로젝트 연결
- ❌ Anthropic API key 발급
- ❌ Resend 계정 + 도메인 인증
- ❌ Discord 봇 토큰 발급

자동화 가능:
- ✅ 시크릿 생성 (`crypto.randomBytes`)
- ✅ DB 마이그레이션 + 시드
- ✅ 코드·문서·테스트 작성
- ✅ Supabase CLI 설치 (`brew install supabase/tap/supabase`)
- ✅ Vercel CLI 배포 (`vercel --prod`, 한 번 로그인 후)
- ✅ GitHub Actions CI

대안: **Local Supabase via Docker** — 클라우드 가입 없이 전체 동작 (단 OAuth는 magic link만)

---

## 9. 비상 연락처 / 참조

- **본인 이메일**: luveach@gmail.com
- **GitHub Issues**: https://github.com/Lonzino/kr-street-dance-battles/issues
- **외부 서비스 Status 페이지**:
  - https://status.supabase.com
  - https://www.vercel-status.com
  - https://status.anthropic.com
- **Next.js 16 docs**: `node_modules/next/dist/docs/` (사이트 차단 시 로컬 참조)

---

## 10. 변경 이력 (체크포인트)

- **2026-04-23**: 본 체크포인트 (Phase A 완료 — 참가 신청 + 댄서 + 체크인까지)
  - 코드 30+ 라우트, 5개 마이그레이션
  - 문서 10개
  - 배포 차단 0건

다음 체크포인트 시 본 문서 갱신:
- 새 페이지·테이블 추가 → 디렉토리 트리 업데이트
- 결정 변경 → 결정 이력 추가
- 외부 서비스 변경 → 의존성 표 + activation 문서

---

**TL;DR**:
- 코드는 더 손볼 필요 없는 상태 (배포 차단 0)
- 본인이 외부 서비스(Supabase·Vercel·OAuth) 셋업 → 라이브
- 그 다음은 데이터 채우기 + 사용자 모집 + 피드백 기반 개선
