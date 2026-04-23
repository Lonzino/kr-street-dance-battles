import type { Metadata } from "next";
import { Bebas_Neue, Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import { UserMenu } from "@/components/UserMenu";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans-ko",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "KR Street Dance Battles",
    template: "%s · KR Street Dance Battles",
  },
  description:
    "한국 스트릿 댄스 배틀 정보 아카이브. 비보잉, 팝핑, 락킹, 왁킹 등 장르별 국내외 대회 일정과 결과를 한 곳에.",
  keywords: ["스트릿댄스", "댄스배틀", "비보이", "팝핑", "락킹", "왁킹", "배틀일정", "댄스크루"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${bebasNeue.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wider text-accent">KR</span>
          <span className="text-sm font-bold sm:text-base">STREET DANCE BATTLES</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink href="/">배틀</NavLink>
          <NavLink href="/crews">크루</NavLink>
          <NavLink href="/dancers">댄서</NavLink>
          <NavLink href="/ranking">랭킹</NavLink>
          <NavLink href="/submit/battle">제보</NavLink>
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p>KR Street Dance Battles · 한국 스트릿 댄스 커뮤니티 아카이브</p>
        <p className="mt-1">
          배틀 정보 제보 · 오탈자 수정은{" "}
          <a
            href="https://github.com/Lonzino/kr-street-dance-battles/issues"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground"
          >
            GitHub Issues
          </a>
          로 ·{" "}
          <Link href="/support" className="underline hover:text-foreground">
            후원
          </Link>
        </p>
        <p className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/terms" className="hover:text-foreground">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            개인정보처리방침
          </Link>
        </p>
      </div>
    </footer>
  );
}
