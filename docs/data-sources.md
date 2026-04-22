# 데이터 소스 전략

## 현실적인 데이터 소스 우선순위

| 순위 | 소스 | 합법성 | 자동화 가능 | 비용 |
|------|------|--------|-------------|------|
| 1 | 사용자 제보 (Discord/웹폼) | ✅ | 부분 (LLM 파싱) | 낮음 |
| 2 | 본인 운영 인스타 계정 (Graph API) | ✅ | 완전 자동 | 무료 |
| 3 | 공식 사이트 (KDO, BBIC, R16 등) | ✅ | 사이트별 어댑터 | 무료 |
| 4 | 뉴스 기사 (네이버 뉴스 API 등) | ✅ | 키워드 + 필터 | 무료 |
| 5 | 인스타 oEmbed (퍼블릭 포스트) | ⚠️ | 부분적 | 무료 |
| 6 | 인스타 직접 스크래핑 | ❌ ToS | 가능하지만 비추 | ban 리스크 |

## 추천: Discord 봇 + LLM 파싱

```
1. Discord 서버 #제보 채널 개설
2. 봇이 메시지 감지 → src/ingestion/pipeline.ts 호출
3. LLM이 텍스트/링크 파싱 → 검토 큐
4. 운영자가 /admin/queue에서 승인
```

**왜 합법:** 사용자가 자발적으로 정보 제공 + 운영자가 큐레이션.
**왜 효과적:** 댄스 씬 사람들이 이미 디스코드/카톡에서 정보 공유 중.

## 인스타 본인 계정 자동화

운영자가 직접 대회 정보 인스타에 올리는 경우:

1. Meta for Developers → 앱 생성
2. **Instagram Graph API** 활성화 (Business 계정 필요)
3. 본인 계정 토큰 발급 (장기 토큰: 60일 유효, 자동 갱신)
4. cron job으로 본인 계정 새 포스트 polling → ingest

## 사이트별 어댑터 추가

새 소스 추가 흐름:

1. `src/ingestion/sources/<name>.ts` 작성 — `SourceAdapter` 인터페이스 구현
2. `src/ingestion/sources/index.ts`의 `adapters` 배열에 추가
3. `match()`에서 URL 패턴 또는 키워드 매칭
4. `fetch()`에서 raw 텍스트 반환

LLM 파서는 동일 — 모든 소스에서 동작.

## 데이터 품질

각 source_record에 기록:
- `source_url`: 원본 추적 가능
- `parse_confidence`: 0~1 (낮으면 검토 우선)
- `parse_warnings`: LLM이 불확실하다고 판단한 필드
- `reviewed_by`, `reviewed_at`: 누가 언제 승인

## 중복 처리

같은 대회를 여러 인스타 계정이 공지하는 경우:

1. `source_records`는 모두 저장 (각각 다른 source_id)
2. `parsed_payload`에서 핵심 필드 추출 (제목, 날짜, 장소)
3. fuzzy match로 기존 published battle과 비교
4. 80% 이상 유사 → admin에서 "기존 X와 병합?" 프롬프트
5. 병합 시 새 source_record는 기존 battle의 sources에 link
