/**
 * JSON → DB 시드 스크립트.
 * 사용: npm run seed
 *
 * 동작:
 * 1. src/data/battles.json, src/data/crews.json 읽기
 * 2. Zod 스키마 검증
 * 3. battles / crews 테이블에 벌크 UPSERT (slug 기준, 트랜잭션)
 * 4. published = true로 마크 (수동 큐레이션 데이터이므로)
 *
 * 안전:
 * - 같은 slug 재실행해도 중복 row 안 생김
 * - 기존 row의 created_at은 보존, updated_at만 갱신
 * - 단일 트랜잭션 — 하나라도 실패하면 전체 롤백
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import battlesJson from "@/data/battles.json";
import crewsJson from "@/data/crews.json";
import { getDb, schema } from "@/db/client";
import { BattleArray, CrewArray } from "@/schema";

async function main() {
  const battles = BattleArray.parse(battlesJson);
  const crews = CrewArray.parse(crewsJson);

  console.log(`[seed] ${battles.length} battles, ${crews.length} crews 검증 통과`);

  const db = getDb();

  await db.transaction(async (tx) => {
    if (battles.length > 0) {
      console.log("[seed] battles 벌크 UPSERT...");
      await tx
        .insert(schema.battles)
        .values(
          battles.map((b) => ({
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
          })),
        )
        .onConflictDoUpdate({
          target: schema.battles.slug,
          set: {
            title: sql`excluded.title`,
            subtitle: sql`excluded.subtitle`,
            description: sql`excluded.description`,
            date: sql`excluded.date`,
            endDate: sql`excluded.end_date`,
            registrationDeadline: sql`excluded.registration_deadline`,
            genres: sql`excluded.genres`,
            formats: sql`excluded.formats`,
            status: sql`excluded.status`,
            venue: sql`excluded.venue`,
            organizer: sql`excluded.organizer`,
            judges: sql`excluded.judges`,
            prize: sql`excluded.prize`,
            entryFee: sql`excluded.entry_fee`,
            posterUrl: sql`excluded.poster_url`,
            links: sql`excluded.links`,
            results: sql`excluded.results`,
            tags: sql`excluded.tags`,
            isPublished: sql`excluded.is_published`,
            updatedAt: sql`now()`,
          },
        });
    }

    if (crews.length > 0) {
      console.log("[seed] crews 벌크 UPSERT...");
      await tx
        .insert(schema.crews)
        .values(
          crews.map((c) => ({
            slug: c.slug,
            name: c.name,
            koreanName: c.koreanName,
            aliases: c.aliases,
            foundedYear: c.foundedYear,
            region: c.region,
            genres: c.genres,
            leader: c.leader,
            members: c.members,
            description: c.description,
            instagramUrl: c.instagramUrl,
            youtubeUrl: c.youtubeUrl,
            tags: c.tags,
          })),
        )
        .onConflictDoUpdate({
          target: schema.crews.slug,
          set: {
            name: sql`excluded.name`,
            koreanName: sql`excluded.korean_name`,
            aliases: sql`excluded.aliases`,
            foundedYear: sql`excluded.founded_year`,
            region: sql`excluded.region`,
            genres: sql`excluded.genres`,
            leader: sql`excluded.leader`,
            members: sql`excluded.members`,
            description: sql`excluded.description`,
            instagramUrl: sql`excluded.instagram_url`,
            youtubeUrl: sql`excluded.youtube_url`,
            tags: sql`excluded.tags`,
            updatedAt: sql`now()`,
          },
        });
    }
  });

  console.log("[seed] 완료.");
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] 실패:", err);
  process.exit(1);
});
