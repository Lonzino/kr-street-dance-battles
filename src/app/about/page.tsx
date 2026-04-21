import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
  description: "KR Street Dance Battles 프로젝트 소개",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-4xl tracking-wide sm:text-6xl">소개</h1>

      <div className="prose prose-invert mt-8 max-w-none text-foreground/90">
        <p className="text-lg leading-relaxed">
          <strong>KR Street Dance Battles</strong>는 한국에서 열리는 스트릿 댄스 배틀 일정,
          결과, 크루 정보를 한 곳에 모으는 커뮤니티 아카이브입니다.
        </p>

        <h2 className="mt-10 text-xl font-bold">다루는 것</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          <li>비보잉, 팝핑, 락킹, 왁킹, 힙합, 하우스, 크럼프 등 모든 스트릿 댄스 장르</li>
          <li>1on1, 2on2, 크루 배틀, 사이퍼, 쇼케이스 전 포맷</li>
          <li>국내 지역 대회 · 국제대회 한국 예선 · 프로·아마추어 구분 없이</li>
          <li>주최자 · 심사위원 · 상금 · 참가비 · 결과 아카이브</li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">기여 방법</h2>
        <p className="mt-3 text-sm leading-relaxed">
          배틀 정보 제보, 오탈자 수정, 결과 업데이트는 모두 GitHub 이슈나 Pull Request로
          받고 있습니다. 데이터는 <code className="rounded bg-muted px-1 py-0.5 text-xs">src/data/battles.json</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">src/data/crews.json</code>에 있습니다.
        </p>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-5 text-sm">
          <p className="font-medium">GitHub</p>
          <a
            href="https://github.com/Lonzino/kr-street-dance-battles"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-accent hover:underline"
          >
            github.com/Lonzino/kr-street-dance-battles ↗
          </a>
        </div>
      </div>
    </div>
  );
}
