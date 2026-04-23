# 전략 분석 (3차 수정 — 2026-04-23)

**작성**: 2026-04-23 (3차)
**핵심 변경**: 이전 분석에서 **HYPETOWN 누락** — 사용자 지적으로 재조사. 이 1개 플레이어 발견으로 **광주 LINE UP 진입 전략 폐기**.

---

## 3차 수정의 이유 (투명하게)

### 이전 분석의 중대한 실수

1차·2차 분석에서 본인이 찾지 못했음:
- **HYPETOWN (hypetown.kr)** — 이미 LINE UP을 처리하고 있는 기존 플레이어
- 사용자가 "이번 라인업 참가 신청 받으려고 하니까 하입타운이라는 회사잖아"로 직접 지적

### 교훈
- 검색 쿼리를 **씬 네이티브 용어**로 먼저 시도하지 않음
- "DanceCode·Danverse" 같은 IT 스타트업 중심 검색 → 실제 씬이 쓰는 서비스 놓침
- **결론**: Atomic network 정하기 전에 **"그 씬이 현재 무엇을 쓰는가"를 운영자에게 직접 물어봐야**

---

## Part 1: HYPETOWN 정밀 분석 (신규)

### 증거 등급 — **Tier 1 완전 검증**

모든 정보 공식 1차 출처에서 직접 확인:

#### 법인 정보 (사업자 등록)
| 항목 | 값 | 출처 |
|------|-----|------|
| 회사명 | 하입타운 (HYPETOWN) | [공식 사이트](https://www.hypetown.kr/) |
| 대표 | 공태현 (TaeHyun Kong) | 공식 사이트 |
| 주소 | 서울 용산구 한남대로11길 8, 6층 | 공식 사이트 |
| **사업자등록번호** | **123-41-69381** | 공식 사이트 |
| **통신판매업 신고** | **제2024-부천소사-00062호** | 공식 사이트 |
| 연락처 | 010-2440-5830 / luke@hypetown.kr | 공식 사이트 |
| 업무시간 | 평일 10:00~18:00 | 공식 사이트 |

**시사점**: 2024년 정식 법인 등록·통신판매업 신고 완료. 1인 운영자·해커톤 프로젝트 아님.

#### 기능 비교 (1차 확인)

| 기능 | 우리 | HYPETOWN | 출처 |
|------|------|----------|------|
| 이벤트 등록·신청 | ✅ | ✅ | [공식](https://slashpage.com/hypetown) |
| **결제 자동화 (PG 연동)** | ❌ (외부 안내만) | ✅ KakaoPay·Toss·PayPal·VISA | [Play Store](https://play.google.com/store/apps/details?id=kr.hypetown.app) |
| 10초 안 참가 완료 | 유사 | ✅ 공식 주장 | 공식 |
| 정원 자동 마감 | 있음 (단순) | ✅ | 공식 |
| **환불·취소 원버튼** | ❌ | ✅ | 공식 |
| **대진표 (브래킷)** | ❌ | ✅ | 공식 |
| 현장 QR 체크인 | ✅ | 미확인 | - |
| 댄서 프로필 | ✅ | 일부 (이벤트 중심) | 공식 |
| 매거진·인터뷰 콘텐츠 | ❌ | ✅ | 공식 |
| **모바일 앱** | ❌ | ✅ iOS + Android | [iOS](https://apps.apple.com/kr/app/hypetown-%ED%95%98%EC%9E%85%ED%83%80%EC%9A%B4/id6471942544) · [Android](https://play.google.com/store/apps/details?id=kr.hypetown.app) |
| 오픈소스 | ✅ | ❌ 상업 독점 | - |
| CC0 데이터 | ✅ | ❌ | - |
| **사용자 CV·이력 자동 축적** | ✅ | 부분 (이벤트 중심) | 추정 |

#### 실적 (공식 발표, 1차)

| 지표 | 값 | 의미 |
|------|-----|------|
| 행사 페이지 조회수 | **2M+ (200만+)** | 생태계 진입 완료 |
| 누적 예매 건수 | **50,000+** | 실제 결제 검증된 플레이어 |

**비교**: 우리는 사용자 0, 이벤트 예매 0.

#### 파트너 주최자 (1차 확인)
- **빛고을댄서스** — **LINE UP 9 IN GWANGJU** (2024.06.06~9) 처리 이력
- BREAK POINTS — BREAK POINTS JAM' 2024
- FLOWMAKER
- 백제예술대학교 — BRING IT
- WITH SESSION
- GROOVECOASTER (동아시아 배틀 리그)

#### 이벤트 포트폴리오 현재 (2026-04-23 시점)
- 2025 HARU DANCE COMPETITION
- MENERGY VOL.2
- 개판 루키 vol.1
- ROOKIES GAME 2026 SEASON1
- GROOVECOASTER ORIGINAL SIDE VOL.5
- 한야잔치

---

## Part 2: 경쟁사 지형 전면 수정

### 직접 경쟁사 (업데이트)

| 경쟁자 | 증거 등급 | 운영 상태 | 규모 | 우리 대비 |
|--------|----------|-----------|------|----------|
| **HYPETOWN** | Tier 1 완전 | 2024~ 정식 법인 | **2M+ 조회·50k+ 예매** | 🔴🔴🔴 **압도적** |
| DanceCode | Tier 1 | 운영 중 | 우리 배틀 27% 사용 | 🔴 높음 |
| Danverse | Tier 2 | 미확인 (DND 8기 프로젝트) | 미확인 | 🟡 낮음 가능 |
| 콘테스트코리아 | Tier 1 | 운영 중 | 범용 공모전 | 🟡 중 |
| FREEZE | Tier 1 | **준비중** | 출시 전 | 🟢 |
| KFD | Tier 1 | 정부 공식 | 공식 브레이킹 | 🟠 공존 |

### 실질 경쟁 재정의

| 순위 | 경쟁자 | 이유 |
|------|--------|------|
| 1 | **HYPETOWN** | 스트릿 댄스 씬 내 결제·참가 운영 레이어를 이미 점유 |
| 2 | **인스타 + 구글폼 + 카톡 관행** | 아직 HYPETOWN 안 쓰는 주최자·작은 대회 |
| 3 | DanceCode | 특히 공식·공공 대회 (제천 청소년 페스티벌 등) |
| 4 | 기타 | — |

---

## Part 3: 포지셔닝 재검토 (전면 수정)

### 이전 포지셔닝 (무효)
> "스트릿 배틀 주최자의 Job을 가장 깊이 해결하는, 씬 네이티브가 운영하는 오픈소스 아카이브"

**왜 무효인가**:
- "주최자 Job 가장 깊이" — **HYPETOWN이 훨씬 앞섬** (결제·대진표·환불 이미 있음)
- "씬 네이티브 운영" — HYPETOWN도 씬 네이티브 (공태현 대표, 스트릿 씬 관계 구축 완료)
- "스트릿 전용" — HYPETOWN도 100% 스트릿 전용

### 남은 진짜 차별 (프레임워크별 재검증)

#### Blue Ocean의 "Create" 재검토
| 이전 Create 주장 | 실제 |
|-----------------|------|
| 오픈소스 + CC0 데이터 | ✅ 여전히 유효 (HYPETOWN은 상업 독점) |
| 씬 네이티브 운영 | ❌ HYPETOWN도 동일 |
| 주최자 도구 깊이 | ❌ HYPETOWN이 더 깊음 |

**유일 남은 Create 축**: **"오픈소스 + 공공 재데이터"**

#### JTBD 재검토
| Job | 우리 우위 | 이유 |
|-----|----------|------|
| 주최자 — 신청·결제 받기 | ❌ HYPETOWN 압승 | PG·환불·정원 다 완성 |
| 주최자 — 결과·기록 축적 | ✅ **우리가 강함** | HYPETOWN은 이벤트 발생 후 아카이브 약함 |
| 참가자 — 대회 발견 | 동급 | 둘 다 검색 가능 |
| 참가자 — 참가 이력 CV 자동 | ✅ **우리가 강함** | HYPETOWN은 이벤트 중심, 댄서 중심 X |
| 팬 — 크루·댄서 활동 따라가기 | ✅ **우리가 강함** | HYPETOWN은 예매 중심, 팔로우 약함 |

### 새 포지셔닝 후보 3개 (결정 필요)

#### 후보 A: 댄서 중심 아카이브 (추천 ★)
> "댄서 개인의 커리어가 자동으로 쌓이는 스트릿 댄스 씬 위키피디아"

**근거**:
- HYPETOWN 약점 영역 (이벤트 중심 → 댄서 중심 X)
- 우리 이미 구현한 것 (댄서 프로필·배틀 결과 자동 연결·크루 alias)
- Blue Ocean Create 진짜 영역

**타겟 Job**:
- 댄서: "내가 참가한 모든 배틀 기록이 자동으로 쌓인다"
- 팬: "내가 좋아하는 댄서·크루 활동을 한 곳에서 본다"
- 주최자: "이 댄서가 몇 번 우승했나 확인한다"

#### 후보 B: HYPETOWN 안 잡은 작은 씬 특화
> "HYPETOWN이 안 다루는 세그먼트 — 동아리·학생·지방 소규모"

**근거**:
- HYPETOWN은 규모 있는 대회 중심 (50,000+ 예매는 큰 대회)
- 소규모 동아리·학생·지방 대회는 구글폼+카톡 관행 유지
- 우리가 atomic network 잡기 쉬움

**리스크**: 소규모 씬은 수익·확장성 낮을 수 있음

#### 후보 C: HYPETOWN 파트너 (공존 전략)
> "이벤트 운영은 HYPETOWN, 댄서 이력·씬 아카이브는 우리"

**근거**:
- HYPETOWN 데이터를 우리에 인덱싱 (API 제안)
- 각자 강점 영역 유지 (윈윈)
- 댄서가 HYPETOWN으로 신청 → 우리가 자동으로 CV에 기록

**리스크**: HYPETOWN이 협력 거절하면 진행 불가

### 추천: **A (댄서 중심) + C (HYPETOWN 파트너십 시도)**

A는 독립 실행 가능, C는 시도해볼 가치 있는 additional layer.

---

## Part 4: Atomic Network 전략 전면 재검토

### 이전 PLAYBOOK 전제 (무효)
- "광주 LINE UP 빛고을댄서스 컨택 → 시즌 11 신청 사이트로 받기 합의"
- **틀렸음**: 빛고을댄서스는 이미 HYPETOWN 사용 (LINE UP 9 2024 실증)
- 시즌 11도 HYPETOWN 사용 거의 확실

### 다시 접근 — 현실 인식
1. **광주 LINE UP에 참가 신청 기능으로 진입 불가**
2. 빛고을댄서스에 "HYPETOWN 대체해달라"는 제안 **씬 네이티브 관계 무시**
3. 우리가 줄 수 있는 건 **HYPETOWN에 없는 가치** — 댄서 개인 이력 축적 + 아카이브

### 새 접근 3가지

#### 접근 1: 빛고을댄서스에 "아카이브·댄서 프로필" 제안
- HYPETOWN이 운영·결제 → 우리는 **결과 아카이브·댄서 이력**
- 메시지: "LINE UP 시즌 11 결과를 사이트에 자동 기록하고, 참가 댄서들의 커리어 페이지 만들어드릴게요. HYPETOWN 대체 아니고 보완입니다"
- 부담 없는 제안 (그쪽 운영 바꿀 필요 X)

#### 접근 2: HYPETOWN 미사용 Atomic Network 재선택
HYPETOWN 사용 안 하는 후보:
- 서울 비보잉 대형 대회 (R16 부활·BBIC — 자체 운영)
- 소규모 동아리·학생 대회
- 지방 씬 (강원·제주)
- 특정 장르 (왁킹·보깅·크럼프 커뮤니티 — HYPETOWN은 힙합/하우스 중심)
- 전주 JBGP (Last For One 주관, 자체 운영)

#### 접근 3: HYPETOWN과 파트너십 제안
- 공태현 대표에게 이메일 (luke@hypetown.kr)
- 제안: "HYPETOWN 이벤트 데이터를 우리 아카이브 API로 제공 — 서로 가치 쌓아가자"
- 위험 낮음 (거절당해도 잃는 것 없음)

---

## Part 5: PLAYBOOK 수정 (요약, 별도 파일 업데이트 필요)

[PLAYBOOK-ATOMIC-NETWORK.md](./PLAYBOOK-ATOMIC-NETWORK.md) 전면 재작성 필요:

### 수정 사항
1. **Day 1 목표 변경**: "빛고을댄서스 HYPETOWN 대체 제안" → "HYPETOWN 안 쓰는 atomic network 재선택"
2. **컨택 템플릿 1 수정**: 결제·신청 기능 제안 X → 아카이브·댄서 프로필 제안 O
3. **검증 지표 변경**: "신청 사이트로 받기 합의" → "결과 데이터 제공 동의"
4. **Pivot 시나리오 추가**: HYPETOWN 관계 건드리지 않는 선에서 작동

---

## Part 6: 솔직한 결론

### 이 발견의 의미

**긍정적**:
- 시장 존재 증명 (HYPETOWN의 2M+ 조회·50k+ 예매 = 스트릿 씬 디지털화 진행 중)
- 우리 코드베이스는 이미 상당한 완성도 → pivot 비용 낮음

**부정적**:
- 당초 핵심 가치 가설 (주최자 도구) 실패
- 광주 LINE UP atomic network 불가능
- HYPETOWN이 앞서 있는 영역 경쟁 무리

### 포기할까?

**아니요. 이유:**
1. 우리 차별 (오픈소스 + 댄서 이력 + 공공 데이터) 여전히 유효
2. HYPETOWN이 안 잡은 영역 존재 (작은 씬·아카이브·댄서 CV)
3. 코드는 이미 충분 (낭비 X)

### 하지만 변경 필수:
1. 포지셔닝 전면 수정 (댄서 중심)
2. 광주 atomic network 포기
3. HYPETOWN 안 쓰는 atomic network 재탐색
4. 공존·파트너십 옵션 열어둠

---

## Part 7: 다음 48시간 액션 (수정)

### 이전 plan (폐기)
- ~~빛고을댄서스 DM (HYPETOWN 대체 제안)~~

### 새 plan
1. **HYPETOWN 앱 다운로드 + 직접 사용 경험**
   - 실제 참가자 경험 체험 (주최자 경험은 못 해도 참가자는 가능)
   - 그들의 UX 분석 → 우리 차별점 명확화

2. **HYPETOWN 안 쓰는 대회 후보 리스트 작성**
   - 우리 11 배틀 데이터에서 HYPETOWN 미사용 대회 추림
   - 현재 데이터상 AIMHIGH·CIDC·제천 = DanceCode 사용 (HYPETOWN 경쟁)
   - LINE UP·WDF·BOTY 등 = HYPETOWN 가능성 높음
   - **적합 후보**: JBGP (전주·Last For One 자체 운영), R16 KOREA 2026 (자체), 부천 세계비보이대회 (부천시 주최)

3. **빛고을댄서스에 새 메시지 검토**
   - HYPETOWN 대체 제안 X
   - "LINE UP 9·10·11 결과를 씬 아카이브에 자동 기록하게 데이터 제공 가능한가" 요청
   - 허락되면 우리 사이트 콘텐츠 풍부 + 빛고을댄서스 측은 부담 0

4. **공태현 (HYPETOWN CEO) 이메일 검토**
   - luke@hypetown.kr
   - 파트너십 제안 (API·데이터 공유)
   - 거절당해도 잃는 것 없음

---

## Part 8: 재검증 필요 영역 (여전히 한계 명시)

- [ ] HYPETOWN 실제 주최자 수수료 (공개 안 됨)
- [ ] HYPETOWN 미사용 대회 비율 (추정만 가능)
- [ ] 씬 네이티브들의 HYPETOWN 만족도 (인터뷰 필요)
- [ ] 우리 "댄서 CV" 가치 실제 수요 (인터뷰 전 가설)

---

## Part 9: 출처 업데이트

### Tier 1 — 신규 HYPETOWN 1차 증거

- [HYPETOWN 공식 사이트 (한국어)](https://www.hypetown.kr/)
- [HYPETOWN 공식 (영어)](https://www.hypetown.kr/en)
- [HYPETOWN slashpage — 회사 소개·실적](https://slashpage.com/hypetown)
- [Google Play Store — kr.hypetown.app](https://play.google.com/store/apps/details?id=kr.hypetown.app)
- [Apple App Store — HYPETOWN](https://apps.apple.com/kr/app/hypetown-%ED%95%98%EC%9E%85%ED%83%80%EC%9A%B4/id6471942544)
- [2025 HARU DANCE COMPETITION](https://www.hypetown.kr/en/event/a4823660-5cad-11f0-849e-bb63355be4aa)
- [HYPETOWN 이용약관](https://hypetown.notion.site/5424bd60f6e1405fa6d91849c4e64d0d)
- [HYPETOWN 개인정보 처리방침](https://hypetown.notion.site/a505e42212534743833521ce92fbe5a4)
- [HYPETOWN 취소·환불](https://hypetown.notion.site/f86d0f9d06a64cac9692717912a43694)
- [HYPETOWN YouTube](https://www.youtube.com/@HYPETOWN-kr)

**법인 식별**:
- 사업자등록번호: 123-41-69381
- 통신판매업: 제2024-부천소사-00062호
- 대표: 공태현
- 주소: 서울특별시 용산구 한남대로11길 8

### Tier 1 — LINE UP 관련 1차
- [BATTLE LINEUP / 빛고을댄서스 Instagram](https://www.instagram.com/lineup_battle/)
- [빛고을댄서스 Threads 게시물 (시즌 10 회고)](https://www.threads.com/@lineup_battle/post/DIgCusfyYV8)
- Slashpage 기록: **LINE UP 9 IN GWANGJU (2024.06.06~9) HYPETOWN 처리**

### 기존 출처 (이전 섹션 참조)
Porter·Blue Ocean·JTBD·Mollick·MIT Sloan·McKinsey 등 유지.

---

## 변경 이력

- 2026-04-23 (1차): 초판 — DanceCode 중심
- 2026-04-23 (2차): Danverse·KFD 추가
- **2026-04-23 (3차, 본 문서)**: **HYPETOWN 발견**. 포지셔닝 전면 수정 (댄서 중심 + 아카이브) · 광주 LINE UP atomic network 폐기 · 새 접근 3가지 제시
