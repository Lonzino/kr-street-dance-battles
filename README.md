# KR Street Dance Battles

한국 스트릿 댄스 배틀 정보 커뮤니티 아카이브.

비보잉 · 팝핑 · 락킹 · 왁킹 · 힙합 · 하우스 · 크럼프 등 국내에서 열리는 스트릿 댄스 배틀의 일정 / 결과 / 크루 정보를 한 곳에 모으는 프로젝트.

## 기능

- 전국 스트릿 댄스 배틀 일정 (접수중 · 예정 · 종료 아카이브)
- 배틀 상세 (장소 · 주최 · 심사위원 · 상금 · 결과)
- 크루 디렉토리
- 장르 / 포맷 / 지역 필터링 (예정)

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- 데이터: JSON 파일 (MVP) → 추후 DB 연동 예정

## 개발

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인.

## 배틀 정보 제보 / 수정

1. **GitHub Issue**: 간단한 정보 제보 · 오탈자 신고는 [이슈](https://github.com/Lonzino/kr-street-dance-battles/issues)로
2. **Pull Request**: 직접 데이터 추가는 `src/data/battles.json` 또는 `src/data/crews.json` 수정 후 PR

### 배틀 데이터 스키마

```typescript
{
  slug: "unique-url-slug",
  title: "대회명",
  subtitle: "부제 (선택)",
  description: "소개",
  date: "2026-07-18",          // ISO 날짜
  endDate: "2026-07-20",       // 다일 대회면 종료일
  registrationDeadline: "2026-06-15",
  genres: ["bboying", "popping"],  // battle.ts 참조
  formats: ["1v1", "crewBattle"],
  status: "upcoming",          // registration | ongoing | finished | cancelled
  venue: {
    name: "장소명",
    address: "주소",
    region: "seoul"            // 17개 광역 + online
  },
  organizer: "주최",
  judges: ["Judge1", "Judge2"],
  prize: [{ rank: "우승", amount: 10000000 }],
  entryFee: 20000,
  links: [{ label: "인스타", url: "...", type: "instagram" }],
  results: [{ rank: 1, crew: "Jinjo Crew" }],
  tags: ["국제대회"]
}
```

## 구조

```
src/
├── app/
│   ├── page.tsx                  # 홈 (배틀 리스트)
│   ├── battles/[slug]/page.tsx   # 배틀 상세
│   ├── crews/page.tsx            # 크루 디렉토리
│   ├── about/page.tsx            # 프로젝트 소개
│   └── layout.tsx                # 공통 헤더/푸터
├── components/
│   └── BattleCard.tsx
├── data/
│   ├── battles.json              # 배틀 데이터
│   └── crews.json                # 크루 데이터
├── lib/
│   ├── data.ts                   # 데이터 조회 헬퍼
│   └── labels.ts                 # 한글 라벨 · 포맷터
└── types/                        # TypeScript 타입 정의
```

## 라이선스

데이터(`src/data/*.json`)는 CC0 (공공정보). 코드는 MIT.
