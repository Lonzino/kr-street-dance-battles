import Link from "next/link";
import { isDbConfigured } from "@/db/client";

export default function AdminHome() {
  const dbReady = isDbConfigured();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        배틀 데이터 수집·검토·공개 흐름을 관리합니다.
      </p>

      {!dbReady && (
        <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-5 text-sm">
          <p className="font-bold text-amber-300">DB가 아직 연결되지 않았습니다.</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-amber-200/90">
            <li>Supabase 프로젝트 생성 (region: Seoul 권장)</li>
            <li><code className="rounded bg-black/30 px-1">.env.local</code>에 <code className="rounded bg-black/30 px-1">DATABASE_URL</code> 설정</li>
            <li><code className="rounded bg-black/30 px-1">npm run db:push</code> 실행 (스키마 적용)</li>
            <li><code className="rounded bg-black/30 px-1">npm run seed</code> 실행 (현재 JSON 데이터 마이그레이션)</li>
          </ol>
          <p className="mt-3 text-xs text-amber-200/70">
            자세한 설정은 <code className="rounded bg-black/30 px-1">docs/setup.md</code> 참고.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <AdminCard
          href="/admin/queue"
          title="검토 큐"
          desc="LLM이 파싱한 배틀 정보 검토·승인"
        />
        <AdminCard
          href="/admin/battles"
          title="공개된 배틀"
          desc="현재 사이트에 공개된 데이터 관리"
        />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          데이터 수집
        </h2>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs">
          {`# 인스타그램 포스트 URL 또는 텍스트 직접 제출
npm run ingest:url -- "https://instagram.com/p/XXXX"
npm run ingest:url -- "5월 4일 부천 힙합 페스티벌..."

# 결과는 검토 큐에 'parsed' 상태로 들어감`}
        </pre>
      </div>
    </div>
  );
}

function AdminCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-border bg-muted/30 p-5 transition-colors hover:border-accent/50"
    >
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </Link>
  );
}
