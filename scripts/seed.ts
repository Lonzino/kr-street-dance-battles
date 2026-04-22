/**
 * JSON → DB 시드 스크립트.
 * 사용: pnpm seed   (또는 npm run seed)
 *
 * 동작:
 * 1. src/data/battles.json, src/data/crews.json 읽기
 * 2. Zod 스키마 검증
 * 3. battles / crews 테이블에 UPSERT (slug 기준)
 * 4. published = true로 마크 (수동 큐레이션 데이터이므로)
 *
 * 안전:
 * - 같은 slug 재실행해도 중복 row 안 생김
 * - 기존 row의 created_at은 보존, updated_at만 갱신
 */
import "dotenv/config";
import battlesJson from "@/data/battles.json";
import crewsJson from "@/data/crews.json";
import { getDb, schema } from "@/db/client";
import { BattleArray, CrewArray } from "@/schema";
import { sql } from "drizzle-orm";

async function main() {
  const battles = BattleArray.parse(battlesJson);
  const crews = CrewArray.parse(crewsJson);

  console.log(`[seed] ${battles.length} battles, ${crews.length} crews 검증 통과`);

  const db = getDb();

  console.log("[seed] battles upsert 중...");
  for (const b of battles) {
    await db
      .insert(schema.battles)
      .values({
        slug: b.slug,
        title: b.title,
        subtitle: b.subtitle,
        description: b.description,
        date: b.date,
        endDate: b.endDate,
        registrationDeadline: b.registrationDeadline,
        genres: b.genres,
        formats: b.formats,
        status: b.status,
        venue: b.venue,
        organizer: b.organizer,
        judges: b.judges,
        prize: b.prize,
        entryFee: b.entryFee,
        posterUrl: b.posterUrl,
        links: b.links,
        results: b.results,
        tags: b.tags,
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: schema.battles.slug,
        set: {
          title: b.title,
          subtitle: b.subtitle,
          description: b.description,
          date: b.date,
          endDate: b.endDate,
          registrationDeadline: b.registrationDeadline,
          genres: b.genres,
          formats: b.formats,
          status: b.status,
          venue: b.venue,
          organizer: b.organizer,
          judges: b.judges,
          prize: b.prize,
          entryFee: b.entryFee,
          posterUrl: b.posterUrl,
          links: b.links,
          results: b.results,
          tags: b.tags,
          isPublished: true,
          updatedAt: sql`now()`,
        },
      });
  }

  console.log("[seed] crews upsert 중...");
  for (const c of crews) {
    await db
      .insert(schema.crews)
      .values({
        slug: c.slug,
        name: c.name,
        koreanName: c.koreanName,
        foundedYear: c.foundedYear,
        region: c.region,
        genres: c.genres,
        leader: c.leader,
        members: c.members,
        description: c.description,
        instagramUrl: c.instagramUrl,
        youtubeUrl: c.youtubeUrl,
        tags: c.tags,
      })
      .onConflictDoUpdate({
        target: schema.crews.slug,
        set: {
          name: c.name,
          koreanName: c.koreanName,
          foundedYear: c.foundedYear,
          region: c.region,
          genres: c.genres,
          leader: c.leader,
          members: c.members,
          description: c.description,
          instagramUrl: c.instagramUrl,
          youtubeUrl: c.youtubeUrl,
          tags: c.tags,
          updatedAt: sql`now()`,
        },
      });
  }

  console.log("[seed] 완료.");
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] 실패:", err);
  process.exit(1);
});
