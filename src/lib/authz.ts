import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/db/client";

/**
 * 권한 단일 진실 — 모든 편집/관리 액션이 이 헬퍼를 통해 검증.
 *
 * 권한 레벨:
 * - admin: 전부 가능 (운영자, 별도 JWT 인증)
 * - organizer (users.role): 본인이 클레임한 배틀 편집 가능
 * - organizer 화이트리스트 (approvedSubmissions ≥ 3): 셀프 등록 시 즉시 게시
 * - user: 셀프 등록만 (검토 큐로)
 */

export interface AuthzContext {
  /** Supabase auth user.id (로그인 안 됐으면 null) */
  authId: string | null;
  /** users.role */
  role?: "user" | "organizer" | "admin";
  approvedSubmissions?: number;
}

export async function canEditBattle(ctx: AuthzContext, battleId: string): Promise<boolean> {
  if (!ctx.authId) return false;
  if (ctx.role === "admin") return true;
  if (!isDbConfigured()) return false;

  const [claim] = await getDb()
    .select({ verifiedAt: schema.organizerClaims.verifiedAt })
    .from(schema.organizerClaims)
    .where(
      and(
        eq(schema.organizerClaims.userId, ctx.authId),
        eq(schema.organizerClaims.battleId, battleId),
      ),
    )
    .limit(1);

  return Boolean(claim?.verifiedAt);
}

export async function canSubmitBattleInstantly(ctx: AuthzContext): Promise<boolean> {
  if (!ctx.authId) return false;
  if (ctx.role === "admin") return true;
  if ((ctx.approvedSubmissions ?? 0) >= 3) return true;
  return false;
}

export async function canClaimCrew(ctx: AuthzContext, _crewId: string): Promise<boolean> {
  // MVP: 누구나 클레임 신청 가능. 운영자가 검증.
  // 추후 Instagram OAuth 연결 시 자동 검증.
  return Boolean(ctx.authId);
}

/**
 * 사용자의 권한 컨텍스트 로드 — server action·page에서 호출.
 */
export async function loadAuthzContext(authId: string | null): Promise<AuthzContext> {
  if (!authId || !isDbConfigured()) return { authId };

  const [user] = await getDb()
    .select({
      role: schema.users.role,
      approvedSubmissions: schema.users.approvedSubmissions,
    })
    .from(schema.users)
    .where(eq(schema.users.id, authId))
    .limit(1);

  return {
    authId,
    role: user?.role,
    approvedSubmissions: user?.approvedSubmissions,
  };
}
