# Security Policy

## 취약점 제보

다음 항목은 **공개 Issue가 아닌 비공개 채널**로 제보해주세요:

- `/api/ingest` · `/api/admin/*` 인증 우회
- `INGEST_TOKEN`, `ADMIN_PASSWORD`, `JWT_SECRET`, `DATABASE_URL` 등 시크릿 유출
- LLM 프롬프트 인젝션으로 검토 큐 우회
- XSS, CSRF, SQL 인젝션
- 의존성 취약점 중 이 프로젝트에 실제 영향 있는 것

## 제보 방법

1. **GitHub Security Advisories** (권장)
   https://github.com/Lonzino/kr-street-dance-battles/security/advisories/new
2. **Discord DM** 운영자에게 직접

## 응답 SLA

- **접수**: 3영업일 이내 확인 회신
- **패치**: 심각도에 따라 다름
  - Critical (인증 우회, RCE): 24~72시간
  - High: 1주
  - Medium/Low: 2주~1달

## 공개 정책

- 패치 배포 후 **30일** 이내에 Security Advisory 공개
- 제보자가 원하면 크레딧 기재

## 지원 버전

`main` 브랜치의 최신 배포본만 지원합니다. 과거 태그/릴리스는 지원하지 않아요.

## 범위 외

다음은 이 레포 취약점이 아닙니다:

- Vercel · Supabase · Anthropic 플랫폼 자체 이슈 (각 서비스로)
- `node_modules` 의존성의 이론적 취약점 중 이 프로젝트 코드 경로에 해당 없는 것
- 기여자가 잘못된 데이터를 넣은 것 (품질 이슈)
