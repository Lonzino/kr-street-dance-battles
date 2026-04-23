import type { Metadata } from "next";
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "후원",
  description: `${SITE_NAME} 운영 후원`,
};

const SUPPORT_LINKS = [
  {
    label: "Buy Me a Coffee",
    url: "https://www.buymeacoffee.com/lonzino",
    desc: "1회성 후원 · 카드 결제",
  },
  {
    label: "Toss",
    url: "https://toss.me/lonzino",
    desc: "토스 송금",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-5xl tracking-wide sm:text-6xl">후원</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {SITE_NAME}는 광고 없이 운영되는 비영리 커뮤니티 아카이브입니다.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          후원 채널
        </h2>
        {SUPPORT_LINKS.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-5 transition-colors hover:border-accent/50"
          >
            <div>
              <h3 className="font-bold">{s.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <span className="text-accent">↗</span>
          </a>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          기여 다른 방법
        </h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            · 배틀 정보 제보:{" "}
            <a href="/submit/battle" className="text-accent hover:underline">
              /submit/battle
            </a>
          </p>
          <p>
            · 오탈자 수정·기능 제안:{" "}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              GitHub
            </a>
          </p>
          <p>· SNS 공유 — 검색 결과로 발견 못 하는 분들이 아직 많아요</p>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-muted/20 p-5 text-xs text-muted-foreground">
        <p className="font-bold text-foreground">후원금 사용처</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>도메인·호스팅·DB 비용</li>
          <li>이메일 발송 비용 (Resend)</li>
          <li>LLM API 비용 (Claude 자동 추출)</li>
          <li>운영 시간</li>
        </ul>
      </section>
    </div>
  );
}
