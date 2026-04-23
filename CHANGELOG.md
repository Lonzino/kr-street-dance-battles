# Changelog

## 1.0.0 (2026-04-23)


### Features

* admin 인증 + 검토 큐 승인/거부 액션 ([62210f8](https://github.com/Lonzino/kr-street-dance-battles/commit/62210f89a00cad6c38f7eef9dd27060e276c67d6))
* **auth:** Phase 0 — Supabase Auth (Kakao + Google) + 사용자 프로필 ([38f0357](https://github.com/Lonzino/kr-street-dance-battles/commit/38f03573057afe228f077e30b55e84da40649ed6))
* DB 스키마 정비 — pgEnum + FK + updatedAt 자동 (G4) ([d6c69aa](https://github.com/Lonzino/kr-street-dance-battles/commit/d6c69aacf821c2427197a579bffeac19d1edb817))
* Discord 봇 + Vercel Cron + 외부 ingest API ([4602978](https://github.com/Lonzino/kr-street-dance-battles/commit/460297822ccc71dfb6c3d550fb5a556fef517bea))
* **p1:** 북마크·알림·iCal·일일 메일 — 댄서 루프 (Phase 1) ([9774a0f](https://github.com/Lonzino/kr-street-dance-battles/commit/9774a0f83ba3d0b26efe4b1136a31996b2690142))
* **p2:** 셀프 등록 + 편집 + 포스터 업로드 — 주최자 루프 (Phase 2) ([e66c1d3](https://github.com/Lonzino/kr-street-dance-battles/commit/e66c1d35e2dd275490af1ba4e88c02e36de92582))
* **p3:** 랭킹 + 후원 + 크루 클레임 (Phase 3 핵심) ([e7428f1](https://github.com/Lonzino/kr-street-dance-battles/commit/e7428f14e296e1c82f5f6725264a5f487a2b1af7))
* **pa:** 참가 신청·주최자 명단·댄서 프로필·현장 체크인 (Phase A) ([dfaa56b](https://github.com/Lonzino/kr-street-dance-battles/commit/dfaa56bdd09e831bfebc282cead22825e3307ccc))
* posterUrl 렌더 + seed 벌크 + next.config.images.remotePatterns (G3) ([b2cc2d5](https://github.com/Lonzino/kr-street-dance-battles/commit/b2cc2d5d811271c68f818353ac210e4d8455bc23))
* SEO — sitemap, robots, og:image, JSON-LD DanceEvent ([217fff0](https://github.com/Lonzino/kr-street-dance-battles/commit/217fff0d7bf14c9eab28d62ca5c92bc4531f382e))
* Tier 4 — Issue→ingest 브릿지 + new-battle CLI + 린트 잔여 정리 ([6cbec87](https://github.com/Lonzino/kr-street-dance-battles/commit/6cbec8713e3f558a6dc356dbbb38048f160adb9d))
* Zod 스키마 + Drizzle DB + LLM 수집 파이프라인 + admin 패널 ([49cb802](https://github.com/Lonzino/kr-street-dance-battles/commit/49cb8024db69b7befabdb4e2a1d8a293dda5bf99))
* 검색 + 크루 alias + 초기 migration SQL (G7) ([bbabd58](https://github.com/Lonzino/kr-street-dance-battles/commit/bbabd58571addefe9894e8471a080f1872e08f90))
* 견고성 (error/loading/not-found) + Biome 린터/포매터 ([a59644f](https://github.com/Lonzino/kr-street-dance-battles/commit/a59644f58e48462095bffa91d2e3e37ec03dbeaf))
* 공개 사이트 DB 전환 — admin 승인이 즉시 반영 (C1, G5) ([770678a](https://github.com/Lonzino/kr-street-dance-battles/commit/770678ad1919e8a6e2516c9480913112e138be1c))
* 로그인 rate limit + JSON-LD offers + 문서/설정 정리 (G6) ([447aba3](https://github.com/Lonzino/kr-street-dance-battles/commit/447aba32f5d93894ac2df383360094a7443c2e25))
* 배포 차단 보안 항목 — rate limit + 약관 + 회원 탈퇴 (C1+C2+C3) ([0283d03](https://github.com/Lonzino/kr-street-dance-battles/commit/0283d036388013396ddc5e8476657dd52ad64869))
* 필터링 UI + 크루 상세 페이지 + 배틀↔크루 링크 ([efcab4b](https://github.com/Lonzino/kr-street-dance-battles/commit/efcab4b6896867735a28b1bab8ece808400cc415))


### Bug Fixes

* **security:** GitHub Actions expression injection + 신청 unique index UX 모순 수정 ([e08d29d](https://github.com/Lonzino/kr-street-dance-battles/commit/e08d29d74f8ba3281fdc65a7a74b2066ba66a108))
* 인증 강화 + LLM 인젝션 방어 + 중복 호출 가드 (G1+G2) ([6130b15](https://github.com/Lonzino/kr-street-dance-battles/commit/6130b1583c052b8bc2111bf417cacbe37b97c865))
