import { desc } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/db/client";

export const dynamic = "force-dynamic";

export default async function AdminBattles() {
  if (!isDbConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-muted-foreground">DB 연결 필요. /admin 참고.</p>
      </div>
    );
  }

  const db = getDb();
  const rows = await db
    .select({
      id: schema.battles.id,
      slug: schema.battles.slug,
      title: schema.battles.title,
      date: schema.battles.date,
      status: schema.battles.status,
      isPublished: schema.battles.isPublished,
    })
    .from(schema.battles)
    .orderBy(desc(schema.battles.date))
    .limit(100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">공개된 배틀</h1>
      <p className="mt-1 text-sm text-muted-foreground">총 {rows.length}건</p>

      <table className="mt-6 w-full text-sm">
        <thead className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="py-2">날짜</th>
            <th className="py-2">제목</th>
            <th className="py-2">상태</th>
            <th className="py-2">공개</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border/50">
              <td className="py-2 text-muted-foreground">{r.date}</td>
              <td className="py-2 font-medium">{r.title}</td>
              <td className="py-2 text-xs">{r.status}</td>
              <td className="py-2 text-xs">{r.isPublished ? "✓" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
