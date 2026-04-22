# Setup Guide

## 0. 로컬 개발 (DB 없이)

```bash
npm install
npm run dev   # http://localhost:3000
```

이 상태에서는 `src/data/*.json`을 읽음. admin은 "DB 미연결" 안내 표시.

## 1. Supabase 셋업

### 1-1. 프로젝트 생성

1. https://supabase.com 가입
2. **New Project** 생성
   - Region: **Northeast Asia (Seoul)** 권장
   - Database password: 안전하게 보관
3. 프로젝트 생성 완료까지 ~2분

### 1-2. Connection String 가져오기

1. Project Settings → **Database**
2. **Connection string** → **URI** 탭
3. **Mode: Transaction** (서버리스 호환)
4. URL을 복사. 비밀번호 자리 `[YOUR-PASSWORD]`를 실제 비밀번호로 교체.

```
postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

### 1-3. .env.local 작성

```bash
cp .env.example .env.local
# 에디터로 열어서 DATABASE_URL 채우기
```

### 1-4. 스키마 적용

```bash
npm run db:push   # 직접 적용 (개발/MVP)
# 또는
npm run db:generate && npm run db:migrate   # 마이그레이션 파일 생성 후 적용 (프로덕션)
```

### 1-5. 시드 데이터 적재

```bash
npm run seed
```

`src/data/*.json`의 모든 데이터가 DB에 들어감 (UPSERT, 중복 안 생김).

## 2. LLM 자동 수집 활성화

### 2-1. Anthropic API 키

1. https://console.anthropic.com/settings/keys
2. **Create Key** → 복사
3. `.env.local`의 `ANTHROPIC_API_KEY=`에 붙여넣기

### 2-2. 첫 수집 테스트

```bash
npm run ingest:url -- "https://www.instagram.com/p/EXAMPLE/"
# 또는 텍스트 직접:
npm run ingest:url -- "5월 4일 부천 힙합 페스티벌. 1on1 힙합/팝핑/락킹 배틀..."
```

콘솔에 `record=<UUID>, confidence=0.85` 같은 출력. http://localhost:3000/admin/queue 에서 확인.

## 3. Admin 인증 (배포 전 필수)

현재 admin은 **누구나 접근 가능**합니다. 실제 배포 전 다음 중 하나:

### 옵션 A: Clerk (가장 빠름)

```bash
npm install @clerk/nextjs
```

`middleware.ts`:
```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdmin = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdmin(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

### 옵션 B: Supabase Auth

(Supabase Auth 가이드 별도 작성 예정)

## 4. Vercel 배포

```bash
# Vercel CLI 또는 dashboard 연결
vercel --prod
```

환경변수:
- `DATABASE_URL`
- `ANTHROPIC_API_KEY`
- (Clerk 사용 시) `CLERK_*` 키
