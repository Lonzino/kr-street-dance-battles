# 인증·보안 리뷰

**리뷰 일자**: 2026-04-23
**범위**: 사용자 인증·운영자 인증·외부 API 토큰·세션·쿠키·DB 접근

---

## 1. 인증 시스템 개요

이 서비스에는 **3개의 분리된 인증 시스템**이 있습니다:

| 시스템 | 대상 | 메커니즘 | 위치 |
|--------|------|----------|------|
| **Supabase Auth** | 일반 사용자 (댄서·주최자) | OAuth (Kakao/Google) → JWT 쿠키 | `src/lib/supabase/*` |
| **Admin JWT** | 운영자 (단일 계정) | 비밀번호 → HMAC SHA-256 JWT 쿠키 | `src/lib/auth.ts`, `src/proxy.ts` |
| **API Token** | Discord 봇 / Vercel Cron | 헤더 토큰 (X-Ingest-Token, Bearer) | `/api/ingest`, `/api/cron/*` |

세 시스템은 **완전히 독립** — admin이 일반 사용자가 아니어도 동작하고, 일반 사용자가 admin이 아니어도 OK.

---

## 2. 강점 (잘 설계된 부분) ✅

### 2-1. 비밀번호 저장 안 함
- 일반 사용자는 OAuth만 — 평문/해시 비밀번호 저장 0건
- 운영자 비밀번호는 환경변수만 (DB·코드에 없음)

### 2-2. JWT 검증
- `jose` 라이브러리로 HMAC SHA-256 서명·검증
- 32자 이상 secret 강제 (`getJwtSecret`)
- `getUser()` 사용 — Supabase 서버 검증 (vs `getSession()` 클라 신뢰 X)

### 2-3. 쿠키 설정
- HttpOnly (JS 접근 차단)
- Secure (프로덕션, HTTPS 전용)
- SameSite=Lax (CSRF 방어)
- 7일 만료 (admin) / Supabase 자동 갱신 (user)

### 2-4. 타이밍 안전 비교
```ts
// src/lib/auth.ts:21
let diff = a.length ^ b.length;
for (let i = 0; i < len; i++) {
  diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
}
```
길이 차이도 일정 시간 내 흡수.

### 2-5. Rate Limiting
- `/admin/login`: IP당 5회/분 (인메모리)
- `/api/upload/poster`: 사용자당 5회/분

### 2-6. CSRF
- Server Actions 사용 — Next.js가 자동 토큰 검증
- 폼 제출은 동일 출처에서만 동작

### 2-7. SQL Injection
- Drizzle ORM의 prepared statement 사용
- 모든 사용자 입력은 placeholder로 바인딩

### 2-8. Prompt Injection
- LLM 입력 `<source_text>` XML 태그로 격리
- "ignore previous", "system prompt" 등 의심 패턴 감지
- 의심 입력은 confidence 0.5로 자동 cap

### 2-9. 권한 분리
- `/admin/*` 운영자 JWT 필수 (proxy.ts)
- `/api/cron/*` CRON_SECRET Bearer 필수
- `/api/ingest` INGEST_TOKEN 헤더 필수
- 사용자 mutation은 모두 server action에서 `getCurrentAuthUser()` 검증
- 배틀 편집은 `canEditBattle(ctx, battleId)` 단일 진실

### 2-10. 환경변수 격리
- 클라이언트 노출용은 `NEXT_PUBLIC_` 접두사만 (Supabase Anon Key 등)
- 서버 시크릿(`JWT_SECRET`, `ADMIN_PASSWORD` 등)은 절대 클라이언트로 새지 않음

---

## 3. 🔴 Critical (배포 전 반드시 해결)

### C1. 회원 탈퇴·데이터 삭제 기능 부재
- **문제**: 한국 개인정보보호법(개정안)에 따라 사용자가 본인 데이터 삭제 요청 가능해야 함
- **현재**: `/profile`에 탈퇴 버튼 없음. Supabase Dashboard에서 수동 삭제만 가능
- **수정**:
  ```
  /profile/delete-account → 확인 → DB row 삭제 + Supabase auth.users 삭제
  ```
  - users.id에 cascade FK로 bookmarks/notification_prefs/organizer_claims는 자동 삭제
  - source_records의 rawContent에 user.id가 평문 저장되므로 anonymize 필요
- **예상 시간**: 1시간

### C2. 개인정보처리방침 + 이용약관 부재
- **문제**: 로그인 페이지에 "동의" 링크만 있고 실제 문서 없음
- **현재**: `/about`만 있음
- **수정**:
  - `/privacy` (개인정보처리방침)
  - `/terms` (이용약관)
  - 로그인 폼에 명시적 체크박스 (선택, 한국법은 명시 동의 필요)
- **예상 시간**: 30분 (템플릿 기반)

### C3. /api/ingest rate limit 없음
- **문제**: INGEST_TOKEN 노출 시 무한 호출 → LLM 비용 폭주 가능
- **현재**: 토큰만 검증, 분당 호출 제한 없음
- **수정**:
  ```ts
  const rl = rateLimitWithCleanup(`ingest:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  ```
- **예상 시간**: 5분

---

## 4. 🟡 High (강력 권장)

### H1. RLS 정책이 마이그레이션에 미포함
- **문제**: `docs/ACTIVATION.md`에만 SQL이 있음 — 사용자가 빠뜨릴 위험
- **영향**: RLS 없으면 anon key로 다른 사용자 데이터 조회 가능
- **수정**:
  - `drizzle/migrations/manual_rls.sql` 추가
  - `docs/setup.md`에서 db:migrate 후 RLS 적용을 강조
- **예상 시간**: 15분

### H2. 운영자 단일 비밀번호 (BUS factor 1)
- **문제**:
  - 운영자 1명만 가능
  - 비밀번호 잊으면 admin 접근 영구 불가 (코드 수정 + 재배포 필요)
  - 2FA 없음
- **수정 옵션**:
  - 옵션 A: `users.role='admin'`으로 통일 (Supabase Auth 기반)
  - 옵션 B: 환경변수에 추가 admin 이메일 화이트리스트
  - 옵션 C: TOTP 2FA 추가 (otpauth 라이브러리)
- **예상 시간**: 옵션 A는 2~3시간

### H3. JWT secret 회전 가이드 부재
- **문제**: 시크릿 노출 시 모든 admin 세션 자동 무효화는 되지만, 운영자가 비밀번호 변경하는 표준 프로세스 미정의
- **수정**: `docs/SECURITY-OPERATIONS.md`에 회전 절차 명시
- **예상 시간**: 10분

### H4. 인메모리 Rate Limit 한계
- **문제**: Vercel 다중 인스턴스에서 분리 — 실효 한도가 인스턴스 수 × limit
- **현재**: 코드 주석에 명시, setup.md에 Upstash 대체 가이드
- **수정**: 트래픽 증가 시 Upstash Redis 또는 @vercel/kv로 교체
- **예상 시간**: 1시간

### H5. /calendar.ics 인증 모델
- **문제**: 사용자 쿠키 기반 → 캘린더 앱(구글/애플)이 인증 못 함 → 비로그인으로 빈 캘린더만 받음
- **현재**: 비로그인은 빈 캘린더 (에러 대신, OK)
- **수정 옵션**:
  - 옵션 A: 사용자별 token URL (`/api/calendar/<token>.ics`)
  - 옵션 B: 다운로드만 지원 (URL 구독 X)
- **예상 시간**: 옵션 A는 30분

### H6. source_records.rawContent에 user.id 평문 저장
- **문제**: 셀프 등록 시 `{ submitter: authId, ... }`로 저장. 회원 탈퇴 시 삭제 안 됨.
- **현재**: PII는 아니지만 추적 가능
- **수정**: 탈퇴 시 rawContent의 submitter를 `"deleted-user-<원래id_해시>"`로 anonymize
- **예상 시간**: 30분 (C1과 함께)

---

## 5. 🟢 Medium (배포 후 점진적)

### M1. 활동 로그 (audit log) 미흡
- 현재 `edit_log` (배틀 수정만), `source_records.reviewedAt` (승인만)
- 누락: admin 로그인 이력, /admin/queue 거부, 권한 변경
- 수정: `audit_log` 테이블 + 모든 admin 액션에 기록

### M2. CSP (Content Security Policy) 헤더 부재
- XSS 방어 추가 레이어
- `next.config.ts`에 headers() 추가:
  ```ts
  headers: async () => [{
    source: "/(.*)",
    headers: [{
      key: "Content-Security-Policy",
      value: "default-src 'self'; img-src 'self' data: https:; ..."
    }]
  }]
  ```

### M3. login 약관 동의 명시 체크박스
- 현재: "로그인하면 동의로 간주" 문구만
- 수정: "□ 이용약관·개인정보처리방침에 동의합니다" 체크박스 (한국법 권장)

### M4. 비밀번호 정책 강제 X
- ADMIN_PASSWORD 길이/복잡도 검증 없음
- 현재: 짧은 비번도 허용
- 수정: 시작 시 `if (ADMIN_PASSWORD.length < 12) console.warn(...)` 정도

### M5. Email PII 중복 저장
- `users.email` + Supabase `auth.users.email` 둘 다 저장
- Supabase에서 이메일 변경 시 동기화 안 됨
- 수정: trigger 또는 ensureUserRow에서 매번 갱신

---

## 6. 🔵 Low (있으면 좋음)

| # | 항목 |
|---|------|
| L1 | HSTS 헤더 (Vercel 자동 처리) |
| L2 | Permissions-Policy 헤더 |
| L3 | 로그 마스킹 (이메일 부분 가림) |
| L4 | Sentry 에러 모니터링 |
| L5 | Supabase Auth 로그인 이력 대시보드 활용 |

---

## 7. 데이터 흐름별 위험도

### 일반 사용자 흐름
```
브라우저 → Kakao/Google OAuth → Supabase Auth → JWT 쿠키
       → /api/* server actions → getCurrentAuthUser() → DB
```
- **위험**: 낮음 (OAuth provider 신뢰, RLS 추가 보호)
- **개선**: RLS 마이그레이션 자동화 (H1)

### 운영자 흐름
```
브라우저 → /admin/login → ADMIN_PASSWORD → JWT 쿠키 (krsdb_admin)
       → /admin/* (proxy.ts 검증) → server actions → DB
```
- **위험**: 중간 (단일 계정, BUS factor 1)
- **개선**: 다중 admin (H2) 또는 2FA

### Discord 봇 → /api/ingest
```
디스코드 메시지 → Railway 봇 → POST /api/ingest (X-Ingest-Token)
              → ingest pipeline → LLM → source_records
```
- **위험**: 토큰 노출 시 LLM 비용 폭주 (C3)
- **개선**: rate limit + 호출 후 비용 모니터링

### Vercel Cron → /api/cron/*
```
Vercel 스케줄러 → GET /api/cron/* (Authorization: Bearer CRON_SECRET)
              → DB mutation
```
- **위험**: 낮음 (Vercel이 시크릿 자동 부여)

---

## 8. 결론 — 배포 전 체크리스트

**반드시 (Critical):**
- [ ] C3. /api/ingest rate limit 추가 (5분)
- [ ] C2. /privacy + /terms 페이지 작성 (30분)
- [ ] C1. /profile에 회원 탈퇴 기능 (1시간)

**강력 권장 (High):**
- [ ] H1. RLS SQL을 마이그레이션 폴더에 추가 (15분)
- [ ] H3. SECURITY-OPERATIONS.md (10분)

**상황에 따라 (Medium):**
- [ ] H2. 다중 admin (운영자 추가 시)
- [ ] M2. CSP 헤더
- [ ] M3. 약관 동의 체크박스

**총 Critical+High만 해결**: 약 2시간.

---

## 부록: 점검 명령어

```bash
# 환경변수 미설정 검사
grep -L "process.env" src/lib/auth.ts

# JWT secret 길이 확인 (32자 이상)
node -e "console.log((process.env.JWT_SECRET ?? '').length)"

# Supabase RLS 활성화 확인 (SQL)
select tablename, rowsecurity from pg_tables
  where schemaname = 'public' and tablename in ('users', 'bookmarks', 'notification_prefs');
```
