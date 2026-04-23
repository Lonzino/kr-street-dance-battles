import { eq, isNotNull } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/db/client";
import type { DanceGenre, Region, User } from "@/schema";

/**
 * 댄서 = nickname을 설정한 회원.
 * /dancers/[nickname] URL로 노출.
 */

type UserRow = typeof schema.users.$inferSelect;

function rowToUser(r: UserRow): User {
  return {
    id: r.id,
    email: r.email ?? null,
    nickname: r.nickname ?? null,
    bio: r.bio ?? null,
    region: r.region ?? null,
    primaryGenres: r.primaryGenres ?? null,
    instagramHandle: r.instagramHandle ?? null,
    avatarUrl: r.avatarUrl ?? null,
    role: r.role,
    approvedSubmissions: r.approvedSubmissions,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

/** 닉네임 설정한 사용자 = 공개 댄서 */
export async function getAllDancers(): Promise<User[]> {
  if (!isDbConfigured()) return [];
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(isNotNull(schema.users.nickname))
    .orderBy(schema.users.nickname);
  return rows.map(rowToUser);
}

export async function getDancerByNickname(nickname: string): Promise<User | null> {
  if (!isDbConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.nickname, nickname))
    .limit(1);
  return row ? rowToUser(row) : null;
}

export async function getAllDancerNicknames(): Promise<string[]> {
  if (!isDbConfigured()) return [];
  const rows = await getDb()
    .select({ nickname: schema.users.nickname })
    .from(schema.users)
    .where(isNotNull(schema.users.nickname));
  return rows.map((r) => r.nickname).filter((n): n is string => n !== null);
}

/**
 * 디렉토리 필터링용.
 */
export async function filterDancers(opts: {
  region?: Region;
  genre?: DanceGenre;
}): Promise<User[]> {
  const all = await getAllDancers();
  return all.filter((d) => {
    if (opts.region && d.region !== opts.region) return false;
    if (opts.genre && !(d.primaryGenres ?? []).includes(opts.genre)) return false;
    return true;
  });
}
