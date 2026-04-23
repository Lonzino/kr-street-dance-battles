# 시크릿 관리

## 현재 상태

`.env.local` (git ignored)에 다음 시크릿이 저장됨:

| 키 | 위험도 | 용도 |
|---|--------|------|
| `JWT_SECRET` | 🔴 Critical | admin JWT 서명 (32+ chars) |
| `ADMIN_PASSWORD` | 🔴 Critical | /admin 접근 비밀번호 |
| `INGEST_TOKEN` | 🟡 High | /api/ingest API 토큰 (LLM 비용 폭주 방어) |
| `CRON_SECRET` | 🟡 High | Vercel Cron 인증 |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 Critical | DB 전체 권한 (회원 탈퇴 시 auth.users 삭제) |
| `DATABASE_URL` | 🔴 Critical | DB 비밀번호 포함 |
| `ANTHROPIC_API_KEY` | 🟡 High | LLM API 비용 청구 |
| `RESEND_API_KEY` | 🟢 Medium | 이메일 발송 |
| `NEXT_PUBLIC_SUPABASE_URL` | – | 공개 OK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | – | 공개 OK (RLS로 보호) |

---

## 안전 보관 (필수)

### 1. 비번 관리자에 백업

`.env.local`은 한 컴퓨터에만 있음 → 디스크 고장 시 영구 분실.

**1Password / Bitwarden / Apple Keychain**에 다음 항목으로 저장:

```
제목: KR Street Dance Battles — Secrets
내용: .env.local 전체 복사 붙여넣기
태그: dev, secrets, production
```

### 2. 시크릿이 노출됐다면 (chat / GitHub / 스크린샷)

**즉시 회전**:

```bash
cd ~/kr-street-dance-battles

# 새 시크릿 3개 생성
node -e "
const c = require('crypto');
['JWT_SECRET', 'INGEST_TOKEN', 'CRON_SECRET', 'ADMIN_PASSWORD'].forEach(k => {
  console.log(k + '=' + c.randomBytes(k === 'ADMIN_PASSWORD' ? 24 : 48).toString('base64url'));
});
"
```

→ 출력값을 `.env.local` + Vercel Dashboard 환경변수에 즉시 교체.
→ 기존 admin 세션 자동 무효화 (JWT_SECRET 바뀌면 재서명 필요).

### 3. Anthropic / Supabase / Resend 키 회전

각 Dashboard에서:
- Anthropic: https://console.anthropic.com/settings/keys → 기존 키 Revoke + 새 키 발급
- Supabase: Project Settings → API → service_role 옆 **Reset** 버튼
- Resend: API Keys → 기존 Delete + 새 Create

→ 새 키를 `.env.local` + Vercel에 교체.

---

## 운영 환경별 시크릿

| 환경 | 위치 | 회전 주기 |
|------|------|-----------|
| **로컬 개발** | `.env.local` (git ignored) | 6개월마다 |
| **프로덕션** | Vercel Dashboard → Settings → Environment Variables | 12개월마다 |
| **CI** | GitHub Actions Secrets (테스트용 더미 OK) | – |
| **Discord 봇** | Railway/Fly.io Dashboard | 12개월마다 |

**프로덕션 시크릿은 로컬과 달라야 함.** 배포 시 새로 생성 권장.

---

## 비밀번호 분실 시

### ADMIN_PASSWORD 잊었을 때

1. 로컬 또는 Vercel Dashboard에서 새 비번 생성:
   ```bash
   node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
   ```
2. `.env.local` 또는 Vercel 환경변수의 `ADMIN_PASSWORD=` 교체
3. 로컬: `npm run dev` 재시작 / Vercel: 자동 재배포 (~1분)
4. 새 비번으로 `/admin/login` 접근

### JWT_SECRET 잊거나 분실 시

영향 없음 (서명 검증용, 새로 생성하면 기존 admin 세션만 무효화 — 재로그인하면 끝).

### DATABASE_URL의 DB 비밀번호 잊었을 때

⚠️ Supabase Dashboard → Project Settings → Database → **Reset database password**
(기존 비번은 영구 분실. 모든 connection string 업데이트 필요)

---

## 절대 하지 말 것

- ❌ `.env.local`을 Slack/카톡/이메일로 공유
- ❌ 시크릿을 코드에 하드코딩
- ❌ 시크릿을 README/문서에 평문 기록
- ❌ 같은 시크릿을 로컬·프로덕션·CI에서 재사용
- ❌ 시크릿을 git commit message에 포함
- ❌ `.env*` 파일을 .gitignore에서 제거
- ❌ Vercel Logs / Sentry 등에 시크릿이 찍히지 않는지 확인 안 함

---

## 정기 점검 (분기마다)

- [ ] Anthropic 사용량 대시보드 — 비정상 호출 확인
- [ ] Supabase Logs — 의심스러운 API 호출 확인
- [ ] Vercel Analytics — 트래픽 패턴 이상 확인
- [ ] GitHub Security → Dependency alerts 처리
- [ ] 시크릿 회전 (비번 매니저 알림 설정)
