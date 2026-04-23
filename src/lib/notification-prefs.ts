import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { DanceGenre, Region } from "@/schema";

export const NotificationChannel = z.enum(["email", "web_push", "discord"]);
export type NotificationChannel = z.infer<typeof NotificationChannel>;

export const NotificationPrefs = z.object({
  channels: z.array(NotificationChannel).min(1),
  regions: z.array(Region).nullable(),
  genres: z.array(DanceGenre).nullable(),
  leadDays: z.number().int().min(0).max(30),
  weeklyDigest: z.boolean(),
  bookmarkAlerts: z.boolean(),
});
export type NotificationPrefs = z.infer<typeof NotificationPrefs>;

export const DEFAULT_PREFS: NotificationPrefs = {
  channels: ["email"],
  regions: null,
  genres: null,
  leadDays: 3,
  weeklyDigest: true,
  bookmarkAlerts: true,
};

export async function getNotificationPrefs(authId: string): Promise<NotificationPrefs> {
  if (!isDbConfigured()) return DEFAULT_PREFS;
  const [row] = await getDb()
    .select()
    .from(schema.notificationPrefs)
    .where(eq(schema.notificationPrefs.userId, authId))
    .limit(1);

  if (!row) return DEFAULT_PREFS;

  return {
    channels: row.channels as NotificationChannel[],
    regions: row.regions ?? null,
    genres: row.genres ?? null,
    leadDays: row.leadDays,
    weeklyDigest: row.weeklyDigest,
    bookmarkAlerts: row.bookmarkAlerts,
  };
}

export async function saveNotificationPrefs(
  authId: string,
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = NotificationPrefs.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  await getDb()
    .insert(schema.notificationPrefs)
    .values({ userId: authId, ...parsed.data })
    .onConflictDoUpdate({
      target: schema.notificationPrefs.userId,
      set: parsed.data,
    });

  return { ok: true };
}
