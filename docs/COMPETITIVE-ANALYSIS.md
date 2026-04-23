# 경쟁 분석 (확장판)

**조사 일자**: 2026-04-23 (2차 확장)
**범위**: 한국 스트릿 댄스 씬의 대회·크루·커뮤니티 관련 서비스

---

## 핵심 발견

1. **직접 경쟁사 최소 2곳**:
   - [DanceCode (dancecode.kr)](https://www.dancecode.kr/) — 상업 운영, 앱 있음
   - [Danverse](https://dnd.ac/projects/46) — 스타트업 MVP, **우리와 거의 동일 포지션**
2. **제도적 경쟁**: [대한민국댄스스포츠연맹 (KFD)](https://www.kfd.or.kr/) — **브레이킹 공식 종목 관할**, 선수 등록 정부 시스템
3. **우리 데이터 확인**: 11배틀 중 3건이 이미 DanceCode 등록 창구 사용 (27%)
4. **실질 최강 경쟁**: 플랫폼이 아니라 **인스타 DM + 구글폼 + 카톡** 관행
5. **해외 플랫폼**: 학원 댄스(재즈·발레) 중심 — 스트릿 배틀 전용 부재
6. **미디어 파트너 후보**: Allthatstreet / Allthatbreak (한국 스트릿 댄스 유튜브 최대 채널)

---

## 경쟁사 전수 조사

### A. 직접 경쟁 (기능·사용자 겹침)

#### A1. DanceCode (dancecode.kr) 🔴 가장 큰 위협
**운영**: WillUEntertainment (서울 금천구 가정동, 02-363-5471)
**상태**: 운영 중 + 앱 (Google Play)

**기능**:
- 행사 등록·신청 (주최자·참가자)
- 실시간 중계
- 행사 영상 아카이브 (YouTube 연동)
- 댄서 활동 기록 + 후원·광고 매칭
- MakeCode (창작 프로젝트 발굴)

**우리 데이터 중 사용 확인**: `aim-high-2026`, `cidc-2026-gyeonggi-south`, `jecheon-youth-dance-festival-2026` (3/11, 27%)

**위협 요소**:
- 선점 효과 (이미 주최자 관계 구축)
- 앱 제공
- 실시간 중계 (우리 없음)
- 후원 시스템 (B2B 파이프)

#### A2. Danverse 🔴 **가장 유사** (신규 발견)
**운영**: DND (Design and Develop) 커뮤니티 8기 프로젝트
**상태**: MVP, 운영 중인지 불확실
**출처**: [DND 프로젝트 페이지](https://dnd.ac/projects/46)

**기능** (우리와 중복도 매우 높음):
- 댄서·댄스팀 프로필
- 공연 등록·홍보 (주최자)
- 지역·장르 필터
- 댄서 간 협업·지식 공유
- 공연 피드백

**기술 스택**: Next.js, TypeScript, React Query, Recoil / Spring Boot, MariaDB, AWS (우리와 거의 동일)

**위협 요소**:
- 포지션 거의 100% 중복 (우리보다 먼저 나왔을 가능성)
- 디자인·브랜딩 이미 있음
- 단점: DND 프로젝트 = 단기 해커톤성 가능, 지속 운영 불확실

**대응**: Danverse 현재 사용자 수·활성도 직접 확인 필수. 죽은 서비스면 우리가 이어갈 기회, 살아있으면 차별화 필요.

#### A3. FREEZE (freezekr.com) 🟡 중간
**상태**: "사이트 준비중" 표시 (2026-04-23 현재 admin 로그인만)
**기능**: 댄스 수업·행사 예약 플랫폼 (준비 중)

**위협 요소**: 출시 전. 대기 단계. 방향 확인 필요.

### B. 간접 경쟁 (범용·이웃 시장)

#### B1. 콘테스트코리아 (contestkorea.com) 🟡
- 범용 공모전 포털 (댄스는 카테고리 하나)
- "Move UP vol.5", "비욘드 K-팝 댄스 챌린지" 등 등록
- **스트릿 배틀 전문성 부족**

#### B2. 원밀리언 (1Million Dance Studio) 🟢
- 댄스 스튜디오 관리·수업
- K-pop 댄스 중심, 스트릿 배틀 X
- **이웃 시장** (대회·스트릿 X)

#### B3. STREAM Studio (streamstudio.app) 🟢
- K-pop 댄스 학습 앱
- 랜덤플레이 댄스·리믹스
- **무관 시장** (학습 중심)

#### B4. Choreographic / Move2move 🟢
- 안무·포메이션 디자인 앱
- 창작 도구, 대회 관리 X
- **무관 시장**

#### B5. heybeagle (heybeagle.co.kr) 🟢
- 댄스팀 섭외 견적 비교
- 공연 수주·B2B
- **이웃 시장** (섭외, 배틀 X)

### C. 제도적·공식 (정부·협회)

#### C1. KFD — 대한민국댄스스포츠연맹 (kfd.or.kr) 🟠 제도 위협
**상태**: 정부 인정 공식 기관, 올림픽공원 소재, 02-415-2090

**공식 관할 종목**:
- 라틴 댄스
- 스탠다드 댄스
- **브레이킹** (공식 종목 포함!)
- 라인 댄스

**시스템**:
- 선수 등록: [g1.sports.or.kr](https://g1.sports.or.kr) (국민체육진흥공단)
- 대회 신청: [result.sports.or.kr](https://result.sports.or.kr)
- 자격증 발급

**위협 요소**:
- 브레이킹이 KFD **공식 종목**이라 전국체전·아시안게임 선수 등록은 이쪽 필수
- 상금 대회·정부 지원금은 KFD 경로
- 공식 대회 결과는 KFD 시스템에 기록 (우리가 참조만 가능)

**우리 포지션**: **비공식·커뮤니티 아카이브**로서 **공존 관계**. 선수 등록 대체 X, 씬의 일상을 기록.

#### C2. 국제스트릿댄스협회 (문체부 비영리법인)
- 문체부 등록 비영리법인 ([등록 정보](https://www.mcst.go.kr/site/s_data/corpNaru/corpView.jsp?pSeq=91))
- 교육·공연 사업 (대회 운영 X)
- **제도적 이웃**

### D. 미디어·콘텐츠 (파트너 가능성)

#### D1. Allthatstreet / Allthatbreak 🤝 파트너
- 한국 스트릿 댄스 **대표 미디어 채널** (YouTube)
- Allthatbreak = 비보이, Allthatstreet = 락킹·팝핀·하우스·힙합·크럼프
- 플랫폼 아님 → **경쟁자 X, 파트너 후보**
- 대회 영상 아카이브 확보 관점에서 제휴 가치 큼

### E. 커뮤니티 (비공식)

#### E1. 디시 댄스 갤러리 (dcinside.com/board/dance) 🟢
- 비보이 중심 커뮤니티 (2016 이후 비보이만 남음)
- 정보 산재, 품질 낮음

#### E2. 네이버 카페 (비보이·크루별 카페) 🟢
- 40~50대 운영자·레거시 팬덤
- 젊은 댄서 이탈

#### E3. 인스타 DM + 구글폼 + 카톡 🔴 **실질 최강**
- 플랫폼 아니지만 씬의 운영 관행
- 모든 대회의 80%+ 이 조합 사용
- **우리가 진짜 대체해야 할 대상**

### F. 해외 유사 (한국 진입 없음)

| 서비스 | 국가 | 특성 |
|--------|------|------|
| DanceComp Genie | 미국 | 학원 댄스 경쟁 |
| Playbook365 | 미국 | 치어·댄스 |
| DanceBUG | 미국 | 비디오 심사 |
| TourPro | 미국 | 경쟁 댄스 학원 |
| Danceplace | 미국 | 다일 이벤트 |

**시사점**: 스트릿 배틀 전용 해외 플랫폼도 없음 — 한국만의 문제 아님.

---

## 갱신된 포지셔닝 분석

### Danverse vs 우리 (가장 중요한 비교)

| 요소 | Danverse | 우리 |
|------|----------|------|
| **포지션** | 댄서 소셜 + 공연 등록 | 배틀 정보 + 참가 신청 + 댄서 프로필 |
| **대상** | 댄서 전체 (장르 불명) | 스트릿 배틀 댄서 |
| **차별** | 공연 피드백·협업 기능 | 주최자 도구 (체크인·QR·결과 입력) |
| **운영 주체** | DND 8기 (해커톤·프로젝트) | 1인 운영 + 커뮤니티 |
| **지속성** | 불확실 (프로젝트 끝나면 중단 가능) | 본인 의지에 따라 지속 |
| **오픈소스** | ❓ | ✅ (GitHub) |
| **실시간 사용자** | ❓ (확인 필요) | 0 (아직) |

**액션 아이템**:
- [ ] Danverse 실제 사용자 수·활성도 직접 확인 (인스타·앱스토어·GitHub 검색)
- [ ] Danverse가 죽은 서비스면: 차별화 부담 줄어듦
- [ ] Danverse가 활발하면: **씬 네이티브 관계**로 차별화 (우리의 빛고을댄서스 직접 협업 같은)

### DanceCode vs 우리

기존 분석 유지 + 새 관점:
- DanceCode는 **K-pop·학원 포함 범용**, Danverse는 **댄서 소셜**, 우리는 **스트릿 배틀 전용 + 주최자 도구**
- 우리 포지션 명확화됨: "**DanceCode보다 깊고, Danverse보다 실용적**"

### KFD vs 우리

완전히 다른 층위:
- KFD = 공식 선수 등록·경기 결과 (정부 시스템)
- 우리 = 비공식·일상 씬 아카이브
- **공존 관계**, 경쟁 X
- 장기: KFD 공식 브레이킹 대회 결과를 우리에 미러링 (API 또는 수동)

---

## 최종 포지셔닝 (수정)

### 이전 (1차 분석)
> "스트릿 씬 전용 오픈 아카이브 + 댄서 개인 포트폴리오"

### 이번 (2차 분석 반영)
> "**스트릿 배틀 씬 네이티브들이 운영하는 주최자 도구 + 아카이브**"

**핵심 차별 3가지**:

1. **씬 네이티브 운영** (상업 X, 커뮤니티 O)
   - DanceCode = 엔터테인먼트 회사 (WillU)
   - Danverse = 외부 개발자 해커톤 프로젝트
   - 우리 = **씬 사람 (본인 + 광주 댄서 직접 협업)**

2. **주최자 운영 도구 깊이**
   - DanceCode, Danverse = 등록 폼
   - 우리 = **신청 + 체크인 + 결제 + 결과 + QR 전 흐름** 한 사이트에서

3. **오픈소스 + CC0 데이터**
   - 다른 경쟁사 모두 독점 데이터
   - 우리 = **씬이 소유** (GitHub, 누구나 포크 가능)

---

## 월간 모니터링 체크리스트 (갱신)

### 매월 점검 (15분)
- [ ] DanceCode 신규 기능·등록 대회 수
- [ ] Danverse 운영 상태 (Google Play / App Store 리뷰)
- [ ] FREEZE 정식 론칭 여부
- [ ] KFD 공식 브레이킹 대회 일정·결과
- [ ] 콘테스트코리아 댄스 카테고리 활성도
- [ ] Allthatstreet 영상 업로드 주기 (파트너십 타이밍)
- [ ] 신규 스타트업 (디스콰이엇·DND 9기 등)

### 위협 신호
- 🚨 Danverse 본격 투자·확장
- 🚨 DanceCode 스트릿 배틀 특화 리브랜드
- 🚨 KFD 공식 종목 확대 (팝핀·락킹 포함 시)
- 🚨 네이버·카카오 진입 (대규모 위협)
- 🚨 우리 코드·UI 복제

### 대응 플레이
- 속도 차별화: **씬 네이티브 관계**가 유일한 해자
- 광주 LINE UP 같은 **살아있는 사용 사례** 구축이 핵심 증거

---

## 시장 규모 재추정 (근거 보강)

이전 "전국 5,000~20,000명" 추정에 추가 근거:
- [KFD](https://www.kfd.or.kr/) 브레이킹 공식 종목 등록 선수 (수백 명 ~ 수천 명)
- 문체부 비영리법인 [국제스트릿댄스협회](https://www.mcst.go.kr/site/s_data/corpNaru/corpView.jsp?pSeq=91) 존재
- LINE UP·JBGP·BBIC·전주 JBGP 18회차 등 정기 대회 다수
- Allthatstreet 구독자 수 (참고 지표 — 시청자 ≠ 댄서지만 관심 시장)

**재추정**:
- **활동 댄서**: 3,000~10,000명
- **관심 시청자/팬**: 10~100만 (유튜브 기반)
- **주최자·운영진**: 50~200명 (대회 운영 가능 인원)
- **국내 연간 주요 대회**: 30~50건 (지역별·장르별)

**시사점**: 초기에 주최자 200명 풀을 전부 컨택하는 게 불가능하지 않음. Atomic network 2~3개 확보 시 시장 과점 가능.

---

## 결론 (수정)

### 이전 결론 vs 이번 결론

**이전**: DanceCode 1곳이 주요 경쟁. 정면 경쟁 X, 스트릿 전용으로 차별화.

**이번**: 직접 경쟁 **최소 2곳** (DanceCode + Danverse). 제도권(KFD)은 공존. 차별화 키워드 3가지 명확화 (**씬 네이티브 · 주최자 도구 깊이 · 오픈소스**).

### 전략 변경 없음
- Atomic network 전략 유효
- 광주 LINE UP 1번 우선 진입
- 경쟁사 벤치마킹보다 **씬 네이티브 관계** 구축이 핵심

### 다음 액션
1. **Danverse 실제 사용자 확인** (우선순위 높음 — 이번 주)
2. 빛고을댄서스 컨택 (PLAYBOOK 따라)
3. Allthatstreet 파트너십 가능성 탐색 (장기)

---

## 출처 (추가분)

### 직접 경쟁 (새로 발견)
- [Danverse — DND 프로젝트 페이지](https://dnd.ac/projects/46)
- [FREEZE (freezekr.com)](https://www.freezekr.com/) — 준비중
- [원밀리언 댄스 스튜디오 — KNOCK 프로필](https://knock.oopy.io/2c096a6a-1b98-444b-ab76-0cf6081f10fc)
- [heybeagle — 댄스팀 섭외](https://www.heybeagle.co.kr/expert/index?category=%EB%8C%84%EC%8A%A4)
- [STREAM Studio — K-POP Dance App](https://www.streamstudio.app/en)
- [Choreographic — 댄스 포메이션 앱](https://apps.apple.com/kr/app/choreographic-%EB%8C%84%EC%8A%A4-%ED%8F%AC%EB%A9%94%EC%9D%B4%EC%85%98/id1608391996)

### 제도·공식
- [대한민국댄스스포츠연맹 (KFD)](https://www.kfd.or.kr/)
- [국민체육진흥공단 선수등록 g1.sports.or.kr](https://g1.sports.or.kr)
- [체육회 경기결과 result.sports.or.kr](https://result.sports.or.kr)
- [문체부 비영리법인 국제스트릿댄스협회](https://www.mcst.go.kr/site/s_data/corpNaru/corpView.jsp?pSeq=91)

### 미디어 (파트너 후보)
- Allthatstreet / Allthatbreak — 유튜브 최대 한국 스트릿 댄스 채널

### 기존 유지
- [DanceCode (dancecode.kr)](https://www.dancecode.kr/) — WillUEntertainment
- [콘테스트코리아](https://www.contestkorea.com/)
- [나무위키 — 비보잉/대회](https://namu.wiki/w/%EB%B9%84%EB%B3%B4%EC%9E%89/%EB%8C%80%ED%9A%8C)

### 학술·원리 (미변경)
- [HBR 2019, multi-homing 원리](https://hbr.org/2019/01/why-some-platforms-thrive-and-others-dont)
- [KISDI 2024 — 한국 SNS 이용 현황](https://www.kisdi.re.kr/report/view.do?key=m2101113025790&masterId=4333447&arrMasterId=4333447&artId=659156)

---

## 변경 이력

- 2026-04-23 (1차): 초안 — DanceCode 발견 + 포지셔닝 A+C
- **2026-04-23 (2차, 본 업데이트)**: Danverse·KFD·FREEZE·heybeagle·Allthatstreet 추가 발견, 포지셔닝 **"씬 네이티브 운영 · 주최자 도구 깊이 · 오픈소스"** 3가지로 재정의
