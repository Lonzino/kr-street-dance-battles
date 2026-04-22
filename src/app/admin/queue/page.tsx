import { desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { ReviewActions } from "./review-actions";

export const dynamic = "force-dynamic";

export default async function ReviewQueue() {
  if (!isDbConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-muted-foreground">DB 연결 필요. /admin 참고.</p>
      </div>
    );
  }

  const db = getDb();
  const records = await db
    .select()
    .from(schema.sourceRecords)
    .where(eq(schema.sourceRecords.status, "parsed"))
    .orderBy(desc(schema.sourceRecords.fetchedAt))
    .limit(50);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">검토 큐</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          LLM이 파싱한 배틀 정보 {records.length}건. 사실 확인 후 승인하세요.
        </p>
      </header>

      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground">검토할 항목이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <article key={r.id} className="rounded-lg border border-border bg-muted/30 p-5">
              <header className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-foreground/10 px-2 py-0.5">{r.sourceType}</span>
                  <span
                    className={`text-muted-foreground ${
                      (r.parseConfidence ?? 0) < 0.6 ? "text-amber-300" : ""
                    }`}
                  >
                    confidence: {r.parseConfidence?.toFixed(2) ?? "—"}
                  </span>
                </div>
                <a
                  href={r.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  원본 ↗
                </a>
              </header>

              {r.parseWarnings && r.parseWarnings.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-amber-300">
                  {r.parseWarnings.map((w, i) => (
                    <li key={i}>⚠ {w}</li>
                  ))}
                </ul>
              )}

              <ReviewActions
                recordId={r.id}
                initialPayload={JSON.stringify(r.parsedPayload, null, 2)}
              />

              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-muted-foreground">
                  원본 텍스트
                </summary>
                <p className="mt-2 whitespace-pre-wrap text-xs text-foreground/80">
                  {r.rawContent}
                </p>
              </details>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
