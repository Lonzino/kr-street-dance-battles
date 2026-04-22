# Discord 봇 — 배틀 제보 자동 수집

지정된 디스코드 채널에 올라오는 메시지(URL 또는 텍스트)를 자동으로 `/api/ingest`로 보내 검토 큐에 추가합니다.

## 셋업

### 1. Discord Application 생성

1. https://discord.com/developers/applications → **New Application**
2. **Bot** 탭 → **Add Bot** → **Token Reset** → 토큰 복사
3. **Privileged Gateway Intents**:
   - ✅ MESSAGE CONTENT INTENT (메시지 내용 읽기)
   - ✅ SERVER MEMBERS INTENT (선택)
4. **OAuth2** → **URL Generator**:
   - Scopes: `bot`
   - Bot Permissions: `Read Messages/View Channels`, `Send Messages`, `Add Reactions`
   - 생성된 URL로 본인 서버에 봇 초대

### 2. 채널 ID 확인

디스코드 설정 → **고급** → **개발자 모드 ON**.
모니터할 채널 우클릭 → **ID 복사**.

### 3. Vercel 측 환경변수 추가

Vercel Dashboard → Settings → Environment Variables:

```
INGEST_TOKEN=<랜덤 32자 이상>
```

생성:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 4. 봇 호스팅

봇은 항상 listening 해야 하므로 별도 호스트 필요. 추천:

- **Railway** (무료티어 충분, $5/월 크레딧)
- **Fly.io**
- **Render**

#### Railway 예시

```bash
# 새 Railway 프로젝트
cd services/discord-bot
echo '{
  "name": "krsdb-discord-bot",
  "scripts": { "start": "tsx index.ts" },
  "dependencies": {
    "discord.js": "^14.16.0",
    "tsx": "^4.21.0"
  }
}' > package.json

npm install
git init && git add . && git commit -m "init"

# Railway CLI
railway login
railway init
railway up
```

Railway 환경변수 설정:
- `DISCORD_BOT_TOKEN`
- `DISCORD_INGEST_CHANNEL_ID`
- `INGEST_API_URL` = `https://your-site.vercel.app/api/ingest`
- `INGEST_TOKEN` (Vercel과 동일)

### 5. 테스트

디스코드 채널에 메시지 올림:
```
https://www.instagram.com/p/EXAMPLE/
```

봇 반응:
- ⏳ 처리중
- ✅ 검토 큐에 추가됨 + confidence 표시

## 흐름

```
사용자 메시지 → 봇 감지 → POST /api/ingest
                          ↓
                    pickAdapter (Instagram/Manual)
                          ↓
                    Claude API 추출
                          ↓
                    source_records에 'parsed' 저장
                          ↓
                    /admin/queue에서 운영자 검토 → 승인 → 공개
```

## 운영 팁

- 봇이 죽었는지 모니터링: UptimeRobot이 ping 보내는 헬스 엔드포인트 추가
- Rate limit: 한 사용자가 1분에 5개 이상 보내면 ignore (악용 방지)
- 에러 알림: 별도 #봇알림 채널에 실패 메시지 forward
