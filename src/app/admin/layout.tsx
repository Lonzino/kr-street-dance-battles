import Link from "next/link";

/**
 * ⚠️ 인증 미구현. 배포 전 반드시 추가:
 *   - Supabase Auth (이메일 매직링크) 또는
 *   - Clerk middleware
 * 임시로 미들웨어에서 IP 화이트리스트만 걸어도 됨.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-300">
        ⚠️ ADMIN — 인증 미구현. 배포 전 미들웨어 추가 필요.
      </div>
      <nav className="mx-auto flex max-w-6xl items-center gap-4 border-b border-border px-4 py-3 text-sm sm:px-6">
        <Link href="/admin" className="font-bold">
          관리자
        </Link>
        <Link href="/admin/queue" className="text-muted-foreground hover:text-foreground">
          검토 큐
        </Link>
        <Link href="/admin/battles" className="text-muted-foreground hover:text-foreground">
          공개된 배틀
        </Link>
        <Link href="/" className="ml-auto text-muted-foreground hover:text-foreground">
          ← 사이트
        </Link>
      </nav>
      {children}
    </div>
  );
}
