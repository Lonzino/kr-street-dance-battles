# Contributing to KR Street Dance Battles

**환영합니다.** 이 프로젝트는 한국 스트릿 댄스 씬의 배틀 정보를 한 곳에 모으는 커뮤니티 아카이브입니다. **누구나** 배틀·크루 정보를 제보하거나 직접 PR을 보낼 수 있습니다.

---

## 기여 경로 3가지

어떤 방식이 본인에게 편한지 고르세요. **모두 같은 검토 큐로 모여서 운영자가 확인한 뒤 공개됩니다.**

### 1. 🟢 가장 쉬운: GitHub Issue 제보 (비개발자 추천)

1. [새 이슈](https://github.com/Lonzino/kr-street-dance-battles/issues/new/choose) 클릭
2. **🔥 배틀 제보** 또는 **👥 크루 추가** 선택
3. 폼 채우기 → 제출

→ 운영자가 검토 후 데이터에 반영. 반영되면 이슈가 자동 닫힘.

### 2. 💬 초간단: Discord 봇 (URL 한 줄 제보)

공식 Discord의 `#배틀제보` 채널에 **공식 인스타 포스트 URL만 붙여넣기**. 봇이 자동으로 파싱해서 검토 큐에 올립니다.

### 3. 🔧 직접 PR (개발자)

JSON 직접 수정 후 PR. 아래 스키마 가이드 참조.

---

## 개발 환경 세팅 (PR 보낼 때)

```bash
git clone https://github.com/Lonzino/kr-street-dance-battles.git
cd kr-street-dance-battles
npm install
npm run dev     # http://localhost:3000
```

PR 전에 세 가지는 꼭 돌리세요:

```bash
npm run validate-data  # Zod 스키마 검증
npm run lint           # Biome
npm run build          # 타입·번들 검증
```

(커밋 시 자동으로 돌게 Husky 훅이 걸려 있어요. 처음 `npm install` 하면 자동 설치됨.)

---

## 데이터 스키마

### 배틀 (`src/data/battles.json`)

```jsonc
{
  "slug": "line-up-season-11-2026",       // 소문자 + 하이픈 + 연도
  "title": "LINE UP Season 11",
  "subtitle": "배틀 라인업 시즌 11",        // optional
  "description": "빛고을댄서스 주관 ...",
  "date": "2026-06-03",                    // ISO 날짜
  "endDate": "2026-06-08",                 // 다일이면
  "registrationDeadline": "2026-05-20",    // optional
  "genres": ["hiphop", "popping", "locking", "waacking"],
  "formats": ["1v1"],
  "status": "upcoming",                    // registration | upcoming | ongoing | finished | cancelled
  "venue": {
    "name": "국립아시아문화전당",
    "address": "광주 동구 문화전당로 38",
    "region": "gwangju"                    // 17개 광역 + online
  },
  "organizer": "빛고을댄서스",
  "judges": ["..."],                       // optional
  "prize": [{ "rank": "우승", "amount": 3000000 }],
  "entryFee": 20000,                       // optional
  "links": [
    { "label": "공식 인스타", "url": "https://...", "type": "instagram" }
  ],
  "results": [{ "rank": 1, "crew": "..." }],  // 종료된 대회
  "tags": ["멀티장르"]
}
```

전체 필드 타입은 [`src/schema/battle.ts`](./src/schema/battle.ts) 참조.

### 크루 (`src/data/crews.json`)

```jsonc
{
  "slug": "jinjo-crew",
  "name": "Jinjo Crew",
  "koreanName": "진조크루",                 // optional
  "aliases": ["Jinjo", "진조"],             // optional, 배틀 결과 매칭 향상
  "foundedYear": 2001,
  "region": "seoul",
  "genres": ["bboying"],
  "description": "사실 위주로 작성",
  "instagramUrl": "...",
  "youtubeUrl": "...",
  "tags": ["레전드"]
}
```

전체 필드는 [`src/schema/crew.ts`](./src/schema/crew.ts).

---

## 슬러그 (slug) 규칙

- **소문자 + 하이픈**: `line-up-season-11-2026`
- **연도 포함**: 연례 대회는 `-2026` 접미
- **한글 사용 금지**: 영문 로마자 전사 (인스타 핸들이나 영문명 있으면 그걸 기준으로)
- **공백·특수문자 금지**
- `battles.json` / `crews.json` 내 **중복 금지** (같은 slug 2개면 validate-data 실패)

💡 slug 생각하기 귀찮으면: `npm run new:battle "2026 LINE UP Season 11"` 하면 자동 제안됩니다.

---

## 출처 규칙

데이터 추가·수정 시 **검증 가능한 1차 출처 1개 이상** 필수:

- ✅ 공식 인스타그램 포스트
- ✅ 공식 홈페이지 공지
- ✅ 언론 보도 (네이버 뉴스, 연합뉴스, 문화 매체 등)
- ❌ 개인 블로그만 (추가 검증 필요)
- ❌ 루머·추측

---

## 커밋 메시지

[Conventional Commits](https://www.conventionalcommits.org/) 스타일:

| 접두 | 의미 | 예시 |
|---|---|---|
| `feat:` | 기능 추가 | `feat: 배틀 상세 페이지에 심사위원 섹션 추가` |
| `fix:` | 버그 수정 | `fix: 날짜 포맷이 UTC로 렌더되는 문제 수정` |
| `data:` | 배틀/크루 데이터 | `data: 2026 LINE UP Season 11 추가` |
| `docs:` | 문서 | `docs: CONTRIBUTING 업데이트` |
| `chore:` | 기타 (빌드·설정) | `chore: Biome 2.5로 업데이트` |
| `refactor:` | 리팩터 (동작 변경 없음) | |

commitlint가 자동으로 검증합니다. 형식 틀리면 커밋 거부돼요.

---

## PR 체크리스트

- [ ] 제목이 conventional commit 형식 (`feat:` / `data:` 등)
- [ ] 출처 링크 1개 이상
- [ ] `npm run validate-data` 통과
- [ ] slug 네이밍 규칙 따름
- [ ] 기존 데이터와 중복 없음

---

## 행동 규약

- **팩트 우선**. 주관 평가("최고의", "전설적")는 실적/연도로 대체.
- **당사자 요청 시 삭제** — 크루나 댄서가 정보 삭제를 요청하면 즉시 처리합니다.
- **LGBTQ+ 볼룸 씬 존중** — 보깅·키키 볼 관련 기여는 해당 커뮤니티의 문화·용어를 존중해 주세요.
- **검열된 정보는 검증** — 특히 청소년 댄서 개인 정보는 최소한으로.

---

## 질문

- **일반 질문**: [Discussions](https://github.com/Lonzino/kr-street-dance-battles/discussions)
- **취약점·보안**: [SECURITY.md](./SECURITY.md)
- **운영자 연락**: Discord 또는 이슈

감사합니다. 🙌
