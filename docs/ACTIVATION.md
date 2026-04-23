# 활성화 가이드 — P0~P3 기능 켜기

코드 작업은 모두 완료. 외부 서비스 셋업 + 환경변수만 채우면 모든 기능 동작.

**예상 총 시간**: 약 1시간

---

## 1. Supabase 프로젝트

1. https://supabase.com 가입 → **New Project**
2. **Region: Northeast Asia (Seoul)** 권장
3. Database password 설정 + 안전 보관
4. 프로젝트 생성 완료 (~2분)

### 1-1. DATABASE_URL 가져오기

Project Settings → **Database** → **Connection string** → **URI**
- Mode: **Transaction** (서버리스 호환)
- 비밀번호 자리 `[YOUR-PASSWORD]`를 실제 값으로 교체

```
postgresql://postgres.xxxx:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

### 1-2. API URL + Anon Key

Project Settings → **API**
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. OAuth Provider (Kakao + Google)

### 2-1. Kakao

1. https://developers.kakao.com → 애플리케이션 추가
2. **앱 키** → REST API 키 복사 → Client ID
3. **카카오 로그인** → 활성화
4. **Redirect URI** 추가:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
5. **동의 항목** → 닉네임·이메일 권한 ON
6. **보안** → Client Secret 발급 → 복사

### 2-2. Google

1. https://console.cloud.google.com → 프로젝트 생성
2. **APIs & Services** → **OAuth consent screen** 설정 (External, 앱 이름 입력)
3. **Credentials** → **Create OAuth client ID** → Web application
4. **Authorized redirect URIs** 추가:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
5. Client ID + Secret 복사

### 2-3. Supabase에 Provider 등록

Supabase Dashboard → **Authentication** → **Providers**
- **Kakao** ON → Client ID + Secret 입력
- **Google** ON → Client ID + Secret 입력

---

## 3. Supabase Storage (포스터 업로드용)

Dashboard → **Storage** → **New bucket**
- Name: `posters`
- **Public bucket** ON

### RLS 정책 추가 (SQL Editor)

```sql
-- 누구나 읽기 가능
create policy "posters_public_read" on storage.objects for select
  using (bucket_id = 'posters');

-- 인증된 사용자만 업로드
create policy "posters_auth_insert" on storage.objects for insert
  with check (bucket_id = 'posters' and auth.uid() is not null);
```

---

## 4. users 테이블 RLS (필수)

Supabase SQL Editor:

```sql
alter table users enable row level security;

create policy "users_self_select" on users for select using (auth.uid() = id);
create policy "users_self_update" on users for update using (auth.uid() = id);
create policy "users_self_insert" on users for insert with check (auth.uid() = id);

alter table bookmarks enable row level security;
create policy "bookmarks_self_select" on bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks_self_modify" on bookmarks for all using (auth.uid() = user_id);

alter table notification_prefs enable row level security;
create policy "prefs_self" on notification_prefs for all using (auth.uid() = user_id);

alter table organizer_claims enable row level security;
-- 본인 클레임은 본인이 조회. 검증된 클레임은 누구나 조회 가능 (배틀 페이지에서 사용).
create policy "claims_self_or_verified" on organizer_claims for select
  using (auth.uid() = user_id or verified_at is not null);
```

---

## 5. Anthropic API Key

1. https://console.anthropic.com/settings/keys
2. **Create Key** → 복사
3. → `ANTHROPIC_API_KEY`

---

## 6. Resend (이메일 알림, 선택)

미설정 시 **dry-run** (콘솔 로그만, 실제 발송 X) — 로컬 테스트는 OK.

1. https://resend.com 가입
2. **API Keys** → Create
3. → `RESEND_API_KEY`
4. (선택) 도메인 verify → `RESEND_FROM=KR Battles <noreply@your-domain.com>`
   - 도메인 미인증이면 `onboarding@resend.dev` 자동 사용 (테스트만)

---

## 7. 시크릿 생성

```bash
# JWT_SECRET (32자 이상)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('base64url'))"

# INGEST_TOKEN (Discord 봇 → /api/ingest)
node -e "console.log('INGEST_TOKEN=' + require('crypto').randomBytes(48).toString('base64url'))"

# CRON_SECRET (Vercel Cron 인증)
node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(48).toString('base64url'))"

# ADMIN_PASSWORD (본인이 정하는 강한 비밀번호)
```

---

## 8. .env.local 작성

```bash
cp .env.example .env.local
```

채울 항목:

```env
DATABASE_URL=postgresql://...

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...

ANTHROPIC_API_KEY=sk-ant-...

ADMIN_PASSWORD=<본인이 정한 강한 비번>
JWT_SECRET=<위에서 생성>

INGEST_TOKEN=<위에서 생성>
CRON_SECRET=<위에서 생성>

# 선택 (없어도 빌드 OK, dry-run으로 동작)
RESEND_API_KEY=re_xxxx
RESEND_FROM=KR Battles <noreply@your-domain.com>

# 배포 후 실제 도메인으로
NEXT_PUBLIC_SITE_URL=https://kr-street-dance-battles.vercel.app
```

---

## 9. DB 적용 + 시드

```bash
npm run db:migrate   # drizzle/ 4개 마이그레이션 적용
npm run seed         # JSON → DB UPSERT
```

위 4번의 RLS SQL은 db:migrate가 적용 안 함 — Supabase SQL Editor에서 직접 실행.

---

## 10. 로컬 검증

```bash
npm run dev
```

체크리스트:
- [ ] http://localhost:3000 — 배틀 11건 노출
- [ ] /login → Kakao/Google 로그인 → /profile redirect
- [ ] /profile에서 닉네임 저장 → 새로고침 후 유지
- [ ] /admin/login → 비밀번호로 진입 → /admin/queue
- [ ] 배틀 카드에 북마크 버튼 노출 (로그인 후)
- [ ] /profile/bookmarks → 북마크한 배틀
- [ ] /submit/battle → 폼 제출 → /admin/queue에 community_submission으로 뜸
- [ ] /admin/queue 승인 → 공개 사이트 즉시 반영 + organizer_claim 발행
- [ ] /battles/[slug]/edit → 본인 등록한 배틀 편집 가능, 다른 배틀은 권한 없음
- [ ] /ranking → 크루별 우승 집계
- [ ] /calendar.ics → 다운로드 후 캘린더 앱에서 열기

---

## 11. Vercel 배포

```bash
vercel --prod
```

또는 Vercel Dashboard에서 GitHub 연결.

### Environment Variables 등록

위 .env.local의 모든 키를 Vercel Dashboard → Settings → Environment Variables에 등록.

`NEXT_PUBLIC_SITE_URL`은 실제 배포 도메인으로 업데이트.

### Cron 활성화

`vercel.json`의 cron이 자동으로 등록됨:
- `/api/cron/refresh-status` — 매일 자정 (KST) 배틀 상태 갱신
- `/api/cron/daily-alerts` — 매일 오전 8시 (KST) 사용자별 알림 메일

Vercel Dashboard → Settings → Cron Jobs에서 확인.

---

## 12. (선택) Discord 봇 배포

`services/discord-bot/README.md` 참조.

Railway 또는 Fly.io에 별도 배포 — 항상 listening.

---

## 활성화 후 첫 1주 추천 작업

1. 데이터 30~50건 백필 (현재 11건)
2. SNS 공유 — 댄스 씬 인스타·디스코드에 사이트 알림
3. Sentry 에러 모니터링 추가
4. 사용자 피드백 받기

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| `/login` 클릭 시 "OAuth 응답에 code가 없습니다" | redirect URI 미일치 | Supabase Dashboard → Auth → Site URL과 일치하는지 확인 |
| 배틀 카드에 북마크 버튼 안 보임 | 비로그인 또는 Supabase 미설정 | /login 후 다시 확인 |
| /admin/queue 승인 후 공개 사이트 반영 안 됨 | DB 미연결 | DATABASE_URL 확인, `npm run db:migrate` 재실행 |
| 일일 메일 발송 안 됨 | RESEND_API_KEY 미설정 | 콘솔 로그에 `[email DRY-RUN]` 떴으면 정상 동작 (실제 발송 X) |
| 포스터 업로드 403 | RLS 정책 누락 | 위 3절 RLS SQL 재실행 |
| 편집 페이지에 권한 없음 | organizer_claim 없음 | admin queue에서 셀프 등록 승인 한 번 거쳐야 자동 발행 |
