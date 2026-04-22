import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
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
        <div className="ml-auto flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            ← 사이트
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
            >
              로그아웃
            </button>
          </form>
        </div>
      </nav>
      {children}
    </div>
  );
}
