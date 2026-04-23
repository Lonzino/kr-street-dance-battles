# 전략 분석 (엄밀판)

**작성**: 2026-04-23
**범위**: 경쟁사 전수 조사 (증거 등급별) + Porter·Blue Ocean·JTBD 프레임워크 기반 포지셔닝 + AI 전략 활용 학술 리서치
**목적**: 기존 [COMPETITIVE-ANALYSIS.md](./COMPETITIVE-ANALYSIS.md)의 표면적 나열을 검증 가능한 1차 증거로 업그레이드

---

## 방법론 투명화

### 증거 등급 (이 문서에서 사용)

| 등급 | 정의 | 예시 |
|------|------|------|
| **Tier 1** | 1차 출처 직접 확인 (운영자 웹사이트·앱 스토어·회사 등록·정부 공문서) | DanceCode `dancecode.kr` 공식 사이트, KFD 공식 홈페이지 |
| **Tier 2** | 신뢰 언론·학술 기관 간접 보도 | HBR·MIT Sloan·McKinsey 리서치 |
| **Tier 3** | 검색 결과로만 확인 (직접 접근 실패) | Play Store 실제 다운로드 수 |
| **가정** | 명시적으로 추론 표시 | "상업 운영사라 씬 귀속도 약할 가능성" |

### 한계 명시
- DanceCode 앱 Play Store 직접 접근 실패 (404) → 다운로드·리뷰 수 **미검증**
- Danverse 실제 운영 상태 **미검증** (DND 프로젝트 페이지만 확인)
- 대부분 경쟁사 MAU·매출 비공개 → 시장 점유율은 **우리 11배틀 데이터 기반 추정만**

---

## Part 1: 경쟁사 분석 (증거 등급별)

### Tier 1 — 운영·존재 검증됨

#### DanceCode (dancecode.kr)

**검증된 사실** (1차 출처):
- 공식 사이트 존재: [dancecode.kr](https://www.dancecode.kr/)
- Google Play 앱 리스팅 존재 (패키지 ID: `com.swing2app.v3.dc8ecb929e3ad46679a781a5036e572ec`)
- 운영사: WillUEntertainment (서울 금천구 가정동)
- 공식 전화: 02-363-5471
- 우리 배틀 데이터 내 **3건 등록 창구 사용 확인** (`aim-high-2026`, `cidc-2026-gyeonggi-south`, `jecheon-youth-dance-festival-2026`)

**공식 주장 기능** (운영사 자가 선언):
- 행사 등록·신청
- 실시간 중계
- 행사 영상 아카이브
- 댄서 활동 기록·후원 매칭

**미검증** (증거 부족):
- ❓ 실제 MAU / 누적 다운로드 수
- ❓ 활성 주최자 수
- ❓ 수수료 구조 (무료 주장이지만 실제 모델 미확인)
- ❓ 앱 최신 업데이트일 (Play Store 접근 실패)

**시장 점유율 추정** (근거 제시):
- 우리 11배틀 무작위 샘플 중 3건에서 등록 창구로 사용 → 표본 27%
- **신뢰 구간**: 샘플 크기 n=11로 매우 작음. 실제 시장 점유율은 10%~50% 범위로 추정 (정확도 낮음)
- 권장: 추가 데이터 수집 (전국 대회 30건 샘플링) 후 재추정

#### KFD — 대한민국댄스스포츠연맹 (kfd.or.kr)

**검증된 사실** (1차 출처):
- 정부 인정 공식 기관: [kfd.or.kr](https://www.kfd.or.kr/)
- 위치: 서울 올림픽공원
- 공식 전화: 02-415-2090
- 이메일: kfd2090@hanmail.net
- **관할 종목에 브레이킹 공식 포함** (공식 홈페이지 메뉴 구조로 확인)
- 선수 등록 경로: [g1.sports.or.kr](https://g1.sports.or.kr) (국민체육진흥공단)
- 경기 결과: [result.sports.or.kr](https://result.sports.or.kr)

**시사점**:
- 브레이킹 공식 대회·전국체전·아시안게임 선수 등록은 KFD 경로 필수
- 팝핀·락킹·왁킹은 공식 종목 **아님** (확인됨)
- 우리와 층위 다름 → **경쟁 X, 공존 가능**

#### 콘테스트코리아 (contestkorea.com)

**검증된 사실** (1차 출처):
- 공식 사이트 존재
- 댄스·무용 카테고리 [별도 페이지](https://contestkorea.com/sub/list.php?int_gbn=1&Txt_bcode=031010001)
- 등록된 대회 예시: "2024 비욘드 K-팝 댄스 챌린지"
- **범용 공모전 포털 — 댄스는 하나의 카테고리**

**미검증**: 댄스 카테고리의 활성도·등록 대회 빈도

### Tier 2 — 존재는 확인, 운영 상태 불확실

#### Danverse

**검증된 사실** (1차 출처):
- DND 커뮤니티 [프로젝트 페이지](https://dnd.ac/projects/46) 존재
- DND (dnd.ac) = 사이드 프로젝트 커뮤니티 ([후기 페이지 존재](https://dnd.ac/reviews))
- **8기 프로젝트** = 해커톤·단기 프로젝트 성격
- 기술 스택 명시: Next.js + TypeScript + React Query + Recoil (프론트) / Spring Boot + MariaDB + AWS (백엔드)

**미검증**:
- ❓ 현재 실제 서비스 운영 여부 (도메인·앱스토어 미확인)
- ❓ 사용자 수
- ❓ 2026년 시점 지속 운영 여부

**해석**:
- DND 8기가 구체적으로 언제 종료됐는지 미확인
- **DND 프로젝트 대부분은 데모 완성 후 해산** (일반적 사이드 프로젝트 패턴)
- **가정 (검증 필요)**: 단기 프로젝트라 현재 사용자 수 매우 적거나 중단됐을 가능성

**액션 필요**: 구글에 "Danverse 2026" 추가 검색 + 앱스토어 확인

#### FREEZE (freezekr.com)

**검증된 사실** (1차 출처, WebFetch):
- 도메인 존재
- 홈페이지에 **"사이트 준비중"** 문구 표시
- admin 로그인 UI만 노출

**결론**: **2026-04-23 기준 정식 론칭 전**. 현 시점 위협 낮음.

### Tier 3 — 이웃 시장 / 간접 영향

각각 검증 수준 낮지만 존재 확인:

| 서비스 | 1차 URL | 포지션 |
|--------|---------|--------|
| 원밀리언 | [knock.oopy.io 프로필](https://knock.oopy.io/2c096a6a-1b98-444b-ab76-0cf6081f10fc) | 댄스 스튜디오 관리·수업 (K-pop 중심) |
| STREAM Studio | [streamstudio.app](https://www.streamstudio.app/en) | K-POP 댄스 학습 앱 |
| Choreographic | [앱스토어 리스팅](https://apps.apple.com/kr/app/choreographic-%EB%8C%84%EC%8A%A4-%ED%8F%AC%EB%A9%94%EC%9D%B4%EC%85%98/id1608391996) | 포메이션 디자인 앱 |
| heybeagle | [heybeagle.co.kr/dance](https://www.heybeagle.co.kr/expert/index?category=%EB%8C%84%EC%8A%A4) | 댄스팀 섭외 견적 비교 (B2B 공연) |
| 스페이스클라우드 | - | 파티룸·연습실 대여 (공간) |

**시사점**: 이웃 시장은 우리와 **직접 겹치지 않음**. 경쟁자 X.

### 해외 비교 (모두 Tier 1, 공식 사이트)

| 서비스 | 국가 | 스트릿 배틀 전용? |
|--------|------|------------------|
| [DanceComp Genie](https://www.dancecompgenie.com/) | 미국 | ❌ 학원 댄스 |
| [Playbook365](https://www.playbook365.com/cheer-dance) | 미국 | ❌ 치어·댄스 |
| [DanceBUG](https://www.dancebug.com/) | 미국 | ❌ 스튜디오 |
| [TourPro](https://tourprosoftware.com/) | 미국 | ❌ 경쟁 댄스 |
| [Danceplace](https://www.danceplace.com/business/) | 미국 | ❌ 다일 이벤트 |

**결론**: 전 세계적으로 **스트릿 배틀 전용 플랫폼 부재**. 블루오션 가능성.

### 파트너 후보 (경쟁 X)

- **Allthatstreet / Allthatbreak** — 한국 스트릿 댄스 대표 YouTube 채널
- **국제스트릿댄스협회** — [문체부 비영리법인 등록](https://www.mcst.go.kr/site/s_data/corpNaru/corpView.jsp?pSeq=91), 교육·공연 사업

### 커뮤니티 (비공식)

- **디시 댄스 갤러리** ([link](https://gall.dcinside.com/board/lists/?id=dance)) — 정보 산재, 품질 낮음
- **네이버 카페** — 운영자 고령화, 젊은 댄서 이탈
- **인스타 + 구글폼 + 카톡** = **실질 최강 경쟁자** (플랫폼 아님, 관행)

---

## Part 2: 포지셔닝 — 3개 프레임워크 병렬 적용

### 프레임워크 1: Porter's Five Forces (HBS Institute for Strategy)

**출처**: [Porter, HBR 2008, "The Five Competitive Forces That Shape Strategy"](https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy) · [HBS Institute for Strategy](https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx)

| 힘 | 우리 산업 분석 | 강도 |
|----|---------------|------|
| **1. 기존 경쟁사 경쟁** | DanceCode·Danverse·KFD·콘테스트코리아 — 다수 존재하나 스트릿 전용 없음 | 🟡 중간 |
| **2. 신규 진입 위협** | 낮은 진입장벽 (Next.js + Supabase MVP 2주면 가능). **네이버·카카오 진입 시 고위협** | 🔴 높음 |
| **3. 대체재 위협** | 인스타 + 구글폼 + 카톡 **무료 + 관성**. 우리 대체 어려움 | 🔴 최고 |
| **4. 공급자 협상력** | 배틀 주최자가 "공급자". 소수 대형 주최자 (빛고을댄서스·퓨전엠씨 등)에 집중 | 🟠 고 |
| **5. 구매자 협상력** | 댄서·참가자 = "구매자". 씬이 작고 네트워크 강해 입소문으로 이탈·유입 빠름 | 🟠 고 |

**Porter 종합 결론**:
- 산업 매력도 **중간~낮음** (대체재·공급자 힘 강함)
- 차별화 없으면 수익성 확보 어려움
- **집중(focus) 전략**이 적합 — 좁은 세그먼트에 깊이

### 프레임워크 2: Blue Ocean Strategy (Kim & Mauborgne, INSEAD)

**출처**: [Kim & Mauborgne, HBR 2004, "Blue Ocean Strategy"](https://hbr.org/2004/10/blue-ocean-strategy) · [HBR 2010, "Blue Ocean vs. Five Forces"](https://hbr.org/2010/05/blue-ocean-vs-five-forces)

**핵심 질문**: "경쟁을 무관하게 만드는 새로운 시장 공간은 어디인가?"

**ERRC Grid (제거·감소·상승·창조)**:

| 행동 | 우리 적용 |
|------|----------|
| **Eliminate (제거)** | 상업 수수료 / 학원 댄스·K-pop 카테고리 / 독점 데이터 |
| **Reduce (감소)** | 일반 기능 피상 구현 (DanceCode 같은 백화점식 X) |
| **Raise (상승)** | 스트릿 씬 전문성 / 주최자 도구 깊이 (체크인·QR 등) / 커뮤니티 운영성 |
| **Create (창조)** | **오픈소스 + CC0 씬 데이터** / 씬 네이티브 운영 / 댄서 개인 포트폴리오 자동 축적 |

**Blue Ocean 결론**: 3가지 "Create" 요소가 진정한 차별점.

### 프레임워크 3: Jobs-to-be-Done (Tony Ulwick · Strategyn)

**출처**: [Strategyn — Ulwick's Original Framework](https://strategyn.com/jobs-to-be-done/) · [HBR 2016, "Know Your Customers' Jobs to Be Done"](https://hbr.org/2016/09/know-your-customers-jobs-to-be-done) · [HBS Online 블로그](https://online.hbs.edu/blog/post/jobs-to-be-done-examples)

**실증 데이터**: 기존 혁신 성공률 17% vs **Outcome-Driven Innovation (ODI) 86%** ([Strategyn 백서](https://strategyn.com/wp-content/uploads/2019/10/Strategyns_Jobs_To_Be_Done_Story.pdf))

**우리 서비스 관련 주요 Jobs**:

#### Job 1. 주최자: "내 대회에 적합한 참가자를 모으고 당일 매끄럽게 운영한다"

| 하위 작업 | 현재 도구 | 고통점 | 우리가 해결? |
|-----------|----------|--------|--------------|
| 참가자 공지 | 인스타 포스트 | 인스타 알고리즘 의존 | ❓ (SEO+알림으로 보완) |
| 신청 받기 | 구글폼 | 장르 enum 없음·중복·결제 안내 따로 | ✅ |
| 참가비 관리 | 무통장 입금 | 확인 수동·엑셀 관리 | ✅ (입금 dropdown) |
| 대진표 | 수동 | 시간 소모 | ❌ (미구현) |
| 현장 체크인 | 종이·인스타 DM 확인 | 줄 길어짐 | ✅ (QR) |
| 결과 기록 | 인스타 스토리 | 검색·축적 안 됨 | ✅ (results 테이블) |

#### Job 2. 참가자: "내 수준에 맞는 배틀 찾아 신청하고 참가 기록 쌓는다"

| 하위 작업 | 현재 도구 | 고통점 | 우리가 해결? |
|-----------|----------|--------|--------------|
| 대회 발견 | 인스타 팔로우·친구 공유 | 놓치는 대회 많음 | ✅ (알림·필터·캘린더) |
| 일정 관리 | 수동 | 중복 신청·까먹음 | ✅ (iCal 구독) |
| 파트너 찾기 | 카톡 | 흩어짐 | ❓ (설계 계획만) |
| 신청 | 구글폼 | 매번 입력 | ✅ (프로필 재사용) |
| 참가 증빙 | 없음 | CV 불가 | ✅ (댄서 프로필 자동 축적) |

#### Job 3. 댄스 팬·관객: "좋아하는 씬·크루·댄서 활동 따라간다"

| 하위 작업 | 현재 도구 | 우리가 해결? |
|-----------|----------|--------------|
| 크루 활동 추적 | 인스타 팔로우 | ✅ (크루 페이지·알림) |
| 결과 확인 | 인스타 포스트 | ✅ (results 아카이브) |
| 스트리밍 | YouTube | ❌ (DanceCode는 실시간 중계 있음) |

**JTBD 결론**:
- 주최자 Job 에서 **대진표 / 커뮤니티 알림**이 취약
- 참가자 Job 에서 **파트너 매칭**이 취약
- 팬 Job 에서 **스트리밍**이 취약 (DanceCode 대비 약점)

---

## Part 3: 최종 포지셔닝 (3개 프레임워크 종합)

### 확정 포지셔닝 문장

> **"스트릿 배틀 주최자의 Job을 가장 깊이 해결하는, 씬 네이티브가 운영하는 오픈소스 아카이브"**

### 근거 (프레임워크별)
- **Porter**: Focus 전략 (좁은 세그먼트 = 스트릿 배틀 전용)
- **Blue Ocean**: 오픈소스 + 씬 네이티브 운영 + 주최자 도구 깊이 = **Create** 축
- **JTBD**: 주최자 Job (신청~체크인~결과) 전 흐름이 우리 강점

### 경쟁사별 포지션 거리

| 경쟁사 | Porter 분류 | Blue Ocean 거리 | JTBD 중첩 |
|--------|-------------|-----------------|-----------|
| DanceCode | Differentiation (범용) | 같은 공간 | 높음 (직접) |
| Danverse | Focus (프로젝트성) | 근처 | 중간 |
| KFD | 공식 권위 | 다른 공간 | 낮음 (공존) |
| 인스타+구글폼 | Cost Leadership (무료) | 가장 가까움 | 최고 (대체재) |

**시사점**: **인스타+구글폼이 가장 큰 경쟁자**. 가격(무료) 경쟁은 불가 → JTBD 깊이로 차별화.

### 차별 메시지 3가지 (씬 네이티브에게)

```
1. "스트릿 배틀 주최해 본 사람이 만든 도구"
   → DanceCode의 상업성·Danverse의 해커톤성 대비
2. "구글폼 10개를 하나로 합친 만큼 빠르고, 인스타만큼 투명"
   → 대체재 대비 직접 가치 제안
3. "코드도 데이터도 씬 소유 (GitHub CC0)"
   → 경쟁사 모두 독점 · 우리 유일한 구조적 차별
```

---

## Part 4: AI를 전략 기획·운영에 활용하는 법 (학술 리서치)

### 출처 등급

**Tier 1 (학술·공식)**:
- Ethan Mollick (Wharton) — *Co-Intelligence* (2024, NYT Bestseller)
- [MIT Sloan Management Review](https://sloanreview.mit.edu/) — Generative AI × Business Strategy 특집
- [HBR Strategy in an Era of Abundant Expertise (2025)](https://hbr.org/2025/03/strategy-in-an-era-of-abundant-expertise)
- [Strategyn (Ulwick) JTBD ODI 방법론](https://strategyn.com/jobs-to-be-done/)

**Tier 2 (컨설팅사 1차 리서치)**:
- McKinsey State of AI 2025
- BCG, "How Generative AI Is Transforming Business"

### 검증된 사실

#### A. 생산성 효과 (정량)
- **McKinsey 2024**: 프로덕트 매니저가 gen AI 도구 사용 시 **PDLC 6개월에서 5% time-to-market 단축** ([McKinsey 원문](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/how-generative-ai-could-accelerate-software-product-time-to-market))
- 시간 절약 주요 영역: 사용자 리서치 종합 · 제품 one-pager 작성 · 백로그 생성

#### B. 조직 적용 원칙 (McKinsey 10-20-70)
- **10% 알고리즘 / 20% 데이터·기술 / 70% 사람·프로세스·문화**
- 가장 큰 난관은 기술 아니라 조직 변화

#### C. 전환 체계 (HBR 2023 "Build a Winning AI Strategy")
단계적 접근:
1. **Experiment** (실험)
2. **Deploy for productivity** (생산성에 배포)
3. **Transform experiences** (경험 변혁)
4. **Build new things** (신규 창출)

#### D. 엔터프라이즈 현황 (McKinsey State of AI 2025)
- **88% 조직이 1개 이상 비즈니스 기능에 AI 정기 사용**
- **~33%만 실제 스케일 단계** (나머지는 실험·파일럿)
- ROI 격차 큼

#### E. Ethan Mollick의 원칙 (*Co-Intelligence*)
- **"Use AI for everything"** — 뭘 잘하고 못하는지 직접 확인
- AI = co-worker, co-teacher, coach 관계
- 비기술자도 사용해야 (기술자 독점 X)
- Wharton Generative AI Labs 공식 연구 기반

#### F. HBR 2025 "Strategy in an Era of Abundant Expertise"
- **AI가 전문성을 민주화** → 1인 사업자가 컨설팅 수준 전략 작성 가능
- 기존: MBA·컨설팅사가 포지셔닝·경쟁 분석 독점
- 지금: 누구나 AI로 같은 분석 수행 가능 (품질 검증은 별개)

### 우리 프로젝트에 적용 (JTBD 방식)

#### 운영자(본인)의 AI 관련 Jobs

| Job | 현재 해결 수준 | AI 활용 |
|-----|--------------|--------|
| 경쟁사·시장 리서치 | 본 문서 = 이미 AI 활용 | Claude + 1차 출처 검증 |
| 사용자 인터뷰 종합 | 미적용 | Whisper 전사 → Claude로 패턴 추출 |
| 고객 페르소나·JTBD 매핑 | 본 문서 = 이미 적용 | ODI 질문 세트 → Claude |
| 컨택 메시지 작성 | 수동 | A/B 변형 Claude로 생성 → 본인 선택 |
| 데이터 LLM 자동 파싱 | `/api/ingest` = 이미 구현 | Claude API |
| 프로덕트 one-pager·로드맵 | 일부 docs/ = 이미 AI 활용 | McKinsey 5% 단축 효과 |

#### 이번 주 추가할 AI 활용

1. **Mollick 원칙 실행**: 빛고을댄서스 컨택 → 인터뷰 녹음 → Whisper 전사 → Claude로 **실제 Jobs** 추출 (가설 아닌 실증)
2. **ODI 인터뷰 스크립트**: Claude로 [Strategyn의 ODI 질문 세트](https://strategyn.com/what-customers-want/) 기반 인터뷰 가이드 자동 생성
3. **경쟁사 월간 모니터링 자동화**: Claude가 주기적으로 DanceCode·Danverse 변화 요약 (현재 수동)

#### 하지 말아야 할 AI 사용
- **Mollick 주의**: 주관적 판단·관계 구축은 AI 아니라 사람 역할
- 빛고을댄서스 컨택 **본인이 직접** — AI 대필 X
- 전략 결정은 AI가 도움 주지만 최종 판단은 본인

### 10-20-70 우리 프로젝트 버전

- **10% 기술**: Claude API, Whisper — 이미 Infra
- **20% 데이터**: 배틀·크루 데이터 수집 + 인터뷰 녹음 데이터 (NEW)
- **70% 사람·프로세스**: **빛고을댄서스 직접 컨택**, 매주 인터뷰, 피드백 기반 수정 — **이게 전부**

코드보다 사람 먼저 강조는 10-20-70 원칙과 정확히 일치.

---

## Part 5: 검증되지 않은 영역 (솔직한 한계)

1. **경쟁사 실제 사용자 수** 아무도 공개 안 함 → 추정만 가능
2. **DanceCode 매출 모델** 미확인 (무료 주장이지만 실제 수익화 불명)
3. **스트릿 댄스 시장 규모** 정확한 통계 부재 (KFD 등록 선수 수만 부분적)
4. **Danverse 현 운영 상태** 미확인 (Play/App Store 직접 검색 필요)
5. **씬 네이티브의 기능 선호도** 인터뷰 전에는 모두 가설

### 이 한계를 어떻게 좁힐까

- 14일 PLAYBOOK 실행 → 첫 인터뷰로 가설 검증
- 경쟁사 실제 사용 여부 인터뷰 질문에 포함 ("DanceCode 써보셨어요?")
- 매주 Danverse·FREEZE 상태 점검 (월간 모니터링)

---

## Part 6: 실행 우선순위

### 다음 7일 (이번 주)

1. **Danverse 실제 운영 여부 직접 확인** (Play/App Store 검색 + Google "Danverse 2026")
2. **빛고을댄서스 인스타 팔로우 + 게시물 3개월 분석** (본인 직접)
3. **DM 전송** ([PLAYBOOK 템플릿 1](./PLAYBOOK-ATOMIC-NETWORK.md#템플릿-1-첫-dm))
4. 답장 대기하는 동안 **Whisper 환경 준비** (인터뷰 녹음 전사용)

### 다음 14일

PLAYBOOK 그대로 진행 + 첫 인터뷰에서 **JTBD 검증** (Strategyn ODI 질문 사용)

### 다음 30일

- 인터뷰 3건 이상 → 실증 기반 JTBD 맵 업데이트
- 경쟁사 월간 모니터링 자동화 (Claude)
- 광주 씬 atomic network 검증 결과 기반 Phase B-2 결정

---

## 출처 (엄밀 등급별)

### Tier 1 — 1차 출처 (직접 확인)

**경쟁사 운영자 공식**:
- [DanceCode (dancecode.kr)](https://www.dancecode.kr/)
- [대한민국댄스스포츠연맹 (kfd.or.kr)](https://www.kfd.or.kr/)
- [콘테스트코리아 댄스 카테고리](https://contestkorea.com/sub/list.php?int_gbn=1&Txt_bcode=031010001)
- [Danverse — DND 프로젝트 페이지](https://dnd.ac/projects/46)
- [FREEZE (freezekr.com)](https://www.freezekr.com/) — 준비중 확인
- [heybeagle 댄스 섭외](https://www.heybeagle.co.kr/expert/index?category=%EB%8C%84%EC%8A%A4)
- [STREAM Studio](https://www.streamstudio.app/en)

**정부·공식**:
- [문체부 비영리법인 — 국제스트릿댄스협회](https://www.mcst.go.kr/site/s_data/corpNaru/corpView.jsp?pSeq=91)
- [국민체육진흥공단 선수등록 g1.sports.or.kr](https://g1.sports.or.kr)
- [체육회 경기결과 result.sports.or.kr](https://result.sports.or.kr)

### Tier 2 — 학술·신뢰 출처 (프레임워크)

**Porter's Five Forces**:
- [Porter, HBR 2008, "The Five Competitive Forces That Shape Strategy"](https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy)
- [HBS Institute for Strategy — Five Forces](https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx)

**Blue Ocean Strategy**:
- [Kim & Mauborgne, HBR 2004, "Blue Ocean Strategy"](https://hbr.org/2004/10/blue-ocean-strategy)
- [HBR 2010, "Blue Ocean vs. Five Forces"](https://hbr.org/2010/05/blue-ocean-vs-five-forces)

**Jobs-to-be-Done (ODI)**:
- [Strategyn — Tony Ulwick's Original Framework](https://strategyn.com/jobs-to-be-done/)
- [Strategyn 백서 PDF](https://strategyn.com/wp-content/uploads/2019/10/Strategyns_Jobs_To_Be_Done_Story.pdf) (17% vs 86% 성공률 데이터)
- [HBR 2016, "Know Your Customers' Jobs to Be Done"](https://hbr.org/2016/09/know-your-customers-jobs-to-be-done)
- [HBS Online — JTBD 실제 사례](https://online.hbs.edu/blog/post/jobs-to-be-done-examples)

### Tier 2 — AI 전략 학술·리서치

**Ethan Mollick (Wharton, *Co-Intelligence*)**:
- [Mollick 교수 프로필 — Wharton](https://mgmt.wharton.upenn.edu/profile/emollick/)
- [Knowledge@Wharton — Co-Intelligence 소개](https://knowledge.wharton.upenn.edu/article/co-intelligence-how-to-live-and-work-with-ai/)
- [Wharton Generative AI Labs](https://gail.wharton.upenn.edu/about-us/)

**MIT Sloan Management Review**:
- [When Generative AI Meets Product Development](https://sloanreview.mit.edu/article/when-generative-ai-meets-product-development/)
- [Artificial Intelligence and Business Strategy 시리즈](https://sloanreview.mit.edu/big-ideas/artificial-intelligence-business-strategy/)
- [Using AI to Enhance Business Operations](https://sloanreview.mit.edu/article/using-ai-to-enhance-business-operations/)
- [Reshaping Business With Artificial Intelligence](https://sloanreview.mit.edu/projects/reshaping-business-with-artificial-intelligence/)

**Harvard Business Review**:
- [Build a Winning AI Strategy for Your Business (2023)](https://hbr.org/2023/07/build-a-winning-ai-strategy-for-your-business)
- [Strategy in an Era of Abundant Expertise (2025)](https://hbr.org/2025/03/strategy-in-an-era-of-abundant-expertise)
- [Generative AI Will Change Your Business (2023)](https://hbr.org/2023/04/generative-ai-will-change-your-business-heres-how-to-adapt)
- [Small Businesses and AI (2024, sponsored by Mastercard)](https://hbr.org/sponsored/2024/10/small-businesses-and-ai-accelerating-innovation-and-inclusion)

**McKinsey (컨설팅 1차 리서치)**:
- [The state of AI in 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
- [How generative AI could accelerate software product time to market](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/how-generative-ai-could-accelerate-software-product-time-to-market)
- [How AI is transforming strategy development](https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/how-ai-is-transforming-strategy-development)
- [The economic potential of generative AI](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier)

### Tier 2 — 관련 학술 (이전 문서 재인용)

- [HBR 2019, Van Alstyne et al., "Why Some Platforms Thrive"](https://hbr.org/2019/01/why-some-platforms-thrive-and-others-dont)
- [Andrew Chen, *The Cold Start Problem*](https://andrewchen.com/chapter-one-cold-start/)
- [KISDI 2024 한국 SNS 통계](https://www.kisdi.re.kr/report/view.do?key=m2101113025790&masterId=4333447&arrMasterId=4333447&artId=659156)

### Tier 3 / 미검증 (명시)

- DanceCode Play Store 실제 다운로드·리뷰 — 직접 접근 실패 (404), 추후 확인 필요
- Danverse 현재 사용자 수 — 확인 필요
- 스트릿 댄스 씬 정확한 시장 규모 — 공식 통계 부재

---

## 변경 이력

- 2026-04-23: 초판 — 엄밀 등급 경쟁사 분석 + Porter/Blue Ocean/JTBD 3개 프레임워크 + AI 학술 리서치 통합
- 이전 문서 [COMPETITIVE-ANALYSIS.md](./COMPETITIVE-ANALYSIS.md)는 본 문서의 요약본으로 유지
