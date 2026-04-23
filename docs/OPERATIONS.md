# 운영 매뉴얼

본인 (Lonzino) 운영자용 작업 매뉴얼. 일상 운영부터 장애 대응까지.

---

## 매일 점검 (5분)

| # | 작업 | 위치 |
|---|------|------|
| 1 | 검토 큐에 신규 등록 있는지 확인 | `/admin/queue` |
| 2 | 부적절한 셀프 등록 거부 | 같은 페이지 |
| 3 | 새 크루 클레임 검토 | `source_records` 중 `type:crew_claim` |

## 매주 점검 (15분)

- [ ] Anthropic 사용량 ($ 비용 확인) — https://console.anthropic.com/settings/usage
- [ ] Supabase Database Size (500MB 무료 한도) — Project → Database → Size
- [ ] Vercel Analytics — 트래픽·에러 패턴
- [ ] Resend 발송 통계 — bounce / spam 비율
- [ ] GitHub Issues 답변

## 매월 점검 (30분)

- [ ] DB 수동 백업 export
- [ ] 시크릿 회전 검토 (분기마다 실제 회전)
- [ ] 데이터 아카이브 (지난해 finished 배틀 정리)
- [ ] TODO.md 업데이트
- [ ] 사용자 피드백 종합

---

## 일상 작업

### A. 검토 큐 처리

**`/admin/queue` 진입:**
```
http://localhost:3000/admin/login   # 로컬
또는 https://kr-street-dance-battles.vercel.app/admin/login   # 프로덕션
```

**판단 기준:**

| 상황 | 처리 |
|------|------|
| 정확하고 사실 | ✓ 승인 → battles 테이블에 published |
| 정보 부족 (장르·포맷 등) | JSON 인라인 편집 후 승인 |
| 가짜·스팸·광고 | ✗ 거부 (reviewer note에 사유) |
| 중복 (이미 등록된 배틀) | ✗ 거부 + note: "duplicate of <slug>" |
| 부적절한 콘텐츠 | ✗ 거부 + 등록자 차단 검토 (3회 누적시 ban) |

**JSON 인라인 편집:**
- 큐 카드의 textarea에서 직접 수정
- Battle Zod 스키마와 strict 매칭 (slug, date, genres, formats 등 enum)
- 검증 실패 시 에러 메시지 노출

### B. 데이터 직접 추가/수정

**3가지 경로:**

1. **JSON 파일 (가장 확실)**:
   ```bash
   vim src/data/battles.json
   git commit -am "data: <변경 내용>"
   git push
   npm run validate-data   # CI에서 자동 실행
   ```
   PR 머지되면 다음 배포에 반영. 단 DB와는 별도 — `npm run seed`로 동기화.

2. **DB 직접 수정** (권장):
   - `/admin/battles` 또는 `/battles/[slug]/edit`에서 편집
   - 즉시 사이트 반영
   - `edit_log`에 자동 기록

3. **셀프 등록 폼**:
   - `/submit/battle` (본인도 가능)
   - approved_submissions ≥ 3이면 즉시 published

### C. 새 크루 등록

JSON 파일 직접:
```bash
# src/data/crews.json에 추가
{
  "slug": "new-crew",
  "name": "Crew Name",
  "koreanName": "한글명",
  "aliases": ["별칭1", "약칭"],
  "region": "seoul",
  "genres": ["bboying"],
  "description": "..."
}

git commit -am "data: add Crew Name"
npm run seed   # DB에도 반영
```

또는 admin이 Supabase Dashboard → Table Editor → crews에서 직접 insert.

### D. 배틀 결과 입력

종료 후 `/battles/[slug]/edit` (또는 Supabase Table Editor):

```json
"results": [
  { "rank": 1, "crew": "Jinjo Crew" },
  { "rank": 2, "crew": "Gamblerz" },
  { "rank": 3, "dancer": "홍길동" }
]
```

`status`도 `finished`로 변경.
크루명이 등록된 크루와 매칭되면 `/crews/[slug]`에 자동으로 "배틀 기록"에 노출.

### E. 사용자 관리

**Supabase Dashboard → Authentication → Users**:
- 사용자 검색·차단·삭제
- 이메일 확인 강제

**users 테이블** (Table Editor):
- `role` 변경: `user` → `organizer` → `admin` (수동 승격)
- `approvedSubmissions` 카운터 조정 (잘못 부여된 신뢰 회수)

**회원 탈퇴 처리**:
- 사용자가 `/profile/delete-account`에서 자동 탈퇴 가능
- 운영자가 수동 처리 시: SQL Editor에서 `DELETE FROM users WHERE id = 'xxx';`
  → cascade로 bookmarks/prefs/claims 자동 삭제
  → source_records anonymize는 자동 안 됨 (`deleteUserAccount()` 호출 필요)

---

## 자동화 모니터링

### Discord 봇 상태

Railway/Fly.io Dashboard에서 헬스체크:
- 봇 프로세스 alive 여부
- 메모리·CPU 사용률
- 마지막 메시지 처리 시각

봇 재시작:
```bash
railway restart   # 또는 fly machine restart
```

### Vercel Cron 실행 이력

Vercel Dashboard → Project → Settings → Cron Jobs → 각 cron의 **Logs** 탭

| Cron | 시각 (UTC) | 한국 시각 |
|------|-----------|-----------|
| `/api/cron/refresh-status` | `0 15 * * *` | 매일 자정 |
| `/api/cron/daily-alerts` | `0 23 * * *` | 매일 오전 8시 |

실행 실패 시 Vercel Logs에 에러. CRON_SECRET 401이면 환경변수 확인.

### LLM 비용 모니터링

Anthropic Console → Settings → Usage
- 일일 사용량 그래프
- 모델별 토큰 수
- 비용 (캐시 적중률 포함)

**비정상 급증 시:**
1. `/api/ingest` 호출 로그 확인 (Vercel Logs)
2. Discord 봇 어뷰즈 가능성
3. 즉시 INGEST_TOKEN 회전 (`docs/SECRETS.md`)
4. 필요 시 ANTHROPIC_API_KEY도 회전

### 이메일 발송 모니터링

Resend Dashboard:
- 발송 성공률 (95%+ 정상)
- bounce 비율 (5% 미만)
- spam 신고 (1% 미만)

높으면 → 도메인 reputation 손상 → SPF/DKIM 검증 강화

---

## 장애 대응 (Runbooks)

### 사이트 다운

**증상**: https://your-site.vercel.app 접근 안 됨

1. Vercel Status 확인: https://www.vercel-status.com
2. 정상이면 → Project → Deployments → 최근 배포 로그
3. 빌드 실패면 → 로컬에서 `npm run build` 재현
4. 정상 배포인데 500 → Vercel Logs에서 런타임 에러 확인

### DB 연결 실패

**증상**: 페이지 로딩 시 "DB가 연결되지 않았습니다"

1. Supabase Status: https://status.supabase.com
2. Supabase Dashboard → Project → 정상 상태인지 확인
3. DATABASE_URL 살아있나 확인:
   ```bash
   psql "$DATABASE_URL" -c "SELECT 1;"
   ```
4. Pooler 연결 한도 초과 가능 → Connection mode 확인 (Transaction mode 사용)

### 로그인 안 됨

**OAuth 에러:**
- Supabase Dashboard → Authentication → Providers → Kakao/Google 활성화 확인
- Redirect URI 일치하는지 (https vs http, www 포함 여부)
- Site URL이 실제 도메인 일치하는지 (Settings → Auth)

**JWT 에러:**
- JWT_SECRET 환경변수 32자 이상 확인
- Vercel과 로컬 SECRET 다르면 한쪽 세션 무효

### LLM 비용 폭주

**즉시 조치:**
1. INGEST_TOKEN 즉시 회전 → `.env.local` + Vercel + Discord 봇 모두 교체
2. Anthropic Console → API Keys → 기존 키 Revoke
3. 새 키 발급 → 환경변수 교체
4. Vercel Logs에서 호출 IP 추적 → 차단 검토

### 어뷰즈 사용자

**증상**: 같은 사용자가 가짜 배틀 폭증

1. Supabase users → 해당 사용자 `approvedSubmissions` 조회
2. 부적절한 source_records 거부 + reviewerNote 기록
3. 3회 누적시 → SQL: `DELETE FROM users WHERE id = 'xxx';`
4. Supabase Auth Users → 해당 계정 Ban (이메일 차단)

### 시크릿 노출 (가장 심각)

**즉시:**
1. 노출 채널에서 메시지 삭제 (가능하면)
2. `docs/SECRETS.md`의 회전 절차 따라 모든 시크릿 회전
3. GitHub 노출이면 → `git filter-repo` 또는 새 repo 생성
4. 노출 시점부터 비정상 활동 점검 (DB 로그, API usage)

---

## 배포

### 코드 변경 → 배포

```bash
# 1. 로컬 검증
npm run lint
npm run build
npm run validate-data

# 2. PR 또는 main 직접 push (소규모면)
git push origin main

# 3. Vercel 자동 배포 (~2분)
# 4. 배포 후 health check
curl https://your-site.vercel.app/api/health   # (없으면 홈)
```

### 마이그레이션

```bash
# 1. drizzle generate (스키마 변경 시)
npm run db:generate -- --name=<descriptive_name>

# 2. drizzle/<NNNN>_<name>.sql 검토 (사람이 한 번 읽기)

# 3. 로컬 DB에 적용 + 검증
DATABASE_URL=<local> npm run db:migrate
DATABASE_URL=<local> npm run seed

# 4. 프로덕션 적용 (Vercel은 db:migrate 안 자동 실행)
DATABASE_URL=<production> npm run db:migrate
```

⚠️ 프로덕션 마이그레이션은 트래픽 적은 시간대에 + 백업 후.

### 롤백

**코드 롤백:**
- Vercel Dashboard → Deployments → 직전 배포 → **Promote to Production**

**DB 롤백:**
- 일반적으로 `down` 마이그레이션 작성 안 됨 (forward-only)
- 백업에서 복원: Supabase Dashboard → Database → Backups (PITR 7일)

---

## 외부 서비스 Dashboard

| 서비스 | URL | 무엇을 보나 |
|--------|-----|-------------|
| Supabase | https://supabase.com/dashboard | DB, Auth, Storage, Logs |
| Vercel | https://vercel.com/dashboard | 배포, Logs, Analytics, Cron |
| Anthropic | https://console.anthropic.com | API key, Usage, Logs |
| Resend | https://resend.com/dashboard | 발송 통계, Domains |
| Kakao Dev | https://developers.kakao.com | OAuth app |
| Google Cloud | https://console.cloud.google.com | OAuth client |
| GitHub | https://github.com/Lonzino/kr-street-dance-battles | 코드, Issues, Actions |
| Railway/Fly | (Discord 봇 호스트) | 봇 프로세스 |

---

## 데이터 백업

### 자동 백업 (Supabase)

- **무료 plan**: 7일 PITR (Point-in-time recovery)
- **Pro plan ($25/월)**: 30일 PITR + daily backups

### 수동 export (월 1회 권장)

```bash
# pg_dump로 전체 dump
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql

# 또는 Supabase Dashboard → Database → Backups → Download
```

→ 외장 드라이브 + 클라우드 (Google Drive 등)에 보관

---

## 새 기능 개발 워크플로

```bash
# 1. issue 생성 또는 TODO.md에 추가
# 2. 브랜치
git checkout -b feature/<name>

# 3. 개발 + 로컬 테스트
npm run dev

# 4. lint + build + 타입체크
npm run lint:fix
npm run build

# 5. 커밋 (commitlint 통과 필요 — feat/fix/docs/refactor/test/chore/style 접두사)
git commit -m "feat: <설명>"

# 6. PR 또는 직접 push (소규모면)
gh pr create   # 또는 git push origin main
```

---

## 보안 사고 시 체크리스트

| 상황 | 즉시 조치 |
|------|-----------|
| 시크릿 노출 의심 | `docs/SECRETS.md` 회전 |
| 비정상 트래픽 | Vercel Analytics + IP 패턴 확인 |
| 데이터 무결성 의심 | Supabase Logs → 의심 SQL 확인 |
| 사용자 신고 | GitHub Issues / 이메일 응답 |
| LLM 비용 폭주 | Anthropic Console + 토큰 회전 |
| OAuth 침해 의심 | Supabase Auth → 해당 사용자 Ban |

---

## 자주 쓰는 명령어 모음

```bash
# 데이터 검증
npm run validate-data

# DB 리셋 + 시드 재실행 (개발)
npm run db:push --force   # ⚠️ 데이터 삭제됨
npm run seed

# Drizzle Studio (DB 시각 편집)
npm run db:studio

# 시크릿 새로 생성
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

# 로컬 dev 서버
npm run dev

# 프로덕션 빌드 시뮬레이션
npm run build && npm start

# Lint + 자동 fix
npm run lint:fix

# 배틀 CLI 등록 (인터랙티브)
npm run new:battle

# 인스타그램 URL ingest (LLM 자동 추출)
npm run ingest:url -- "https://instagram.com/p/XXX"
```

---

## 연락·지원

- 운영자: luveach@gmail.com
- GitHub Issues: https://github.com/Lonzino/kr-street-dance-battles/issues
- 보안 신고: 같은 이메일 + 제목에 `[SECURITY]`

---

## 변경 이력

- 2026-04-23: 초안 (P0~P3 완료 시점)
