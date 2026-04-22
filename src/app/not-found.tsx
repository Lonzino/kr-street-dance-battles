import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="font-display text-7xl text-accent">404</div>
      <h1 className="mt-4 text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        URL이 잘못되었거나 삭제된 콘텐츠일 수 있습니다.
      </p>
      <div className="mt-8 flex gap-3 text-sm">
        <Link
          href="/"
          className="rounded-md bg-accent px-4 py-2 font-bold text-black hover:opacity-90"
        >
          홈으로
        </Link>
        <Link
          href="/crews"
          className="rounded-md border border-border px-4 py-2 hover:border-accent"
        >
          크루 보기
        </Link>
      </div>
    </div>
  );
}
