import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import { performCheckIn } from "../../../battles/[slug]/admin/actions";

export const metadata: Metadata = {
  title: "체크인",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * QR 코드 스캔 시 이동하는 URL: /admin/check-in/<token>
 *
 * 흐름:
 * 1. 토큰으로 registration 조회 → category → battle 추적
 * 2. 운영자/주최자 권한 확인
 * 3. 자동 체크인 + 결과 표시
 *
 * 모바일 친화 UI — 한 번에 한 명씩 처리.
 */
export default async function CheckInPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!isDbConfigured()) {
    return <Message title="DB 미연결" message="DATABASE_URL 환경변수가 설정되지 않았습니다." />;
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    return (
      <Message title="로그인 필요" message="체크인하려면 운영자 계정으로 로그인하세요.">
        <Link
          href={`/login?next=/admin/check-in/${token}`}
          className="mt-4 inline-block rounded-lg bg-accent px-5 py-2 text-sm font-bold text-black"
        >
          로그인
        </Link>
      </Message>
    );
  }

  // 토큰 → registration → category → battle
  const [reg] = await getDb()
    .select({
      id: schema.registrations.id,
      categoryId: schema.registrations.categoryId,
      battleId: schema.battleCategories.battleId,
      battleSlug: schema.battles.slug,
      battleTitle: schema.battles.title,
    })
    .from(schema.registrations)
    .innerJoin(
      schema.battleCategories,
      eq(schema.battleCategories.id, schema.registrations.categoryId),
    )
    .innerJoin(schema.battles, eq(schema.battles.id, schema.battleCategories.battleId))
    .where(eq(schema.registrations.checkInToken, token))
    .limit(1);

  if (!reg) {
    return <Message title="유효하지 않은 토큰" message="QR 코드를 다시 확인해주세요." />;
  }

  const ctx = await loadAuthzContext(authUser.id);
  const allowed = await canEditBattle(ctx, reg.battleId);
  if (!allowed) {
    return <Message title="권한 없음" message="이 배틀의 주최자만 체크인할 수 있습니다." />;
  }

  // 즉시 체크인
  const result = await performCheckIn(reg.battleId, reg.battleSlug, token);

  if (!result.ok) {
    return <Message title="체크인 실패" message={result.error} />;
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-10 text-center">
      <div
        className={`flex h-24 w-24 items-center justify-center rounded-full ${
          result.alreadyChecked ? "bg-amber-500/20" : "bg-emerald-500/20"
        }`}
      >
        <span
          className={`text-5xl ${result.alreadyChecked ? "text-amber-300" : "text-emerald-300"}`}
        >
          {result.alreadyChecked ? "!" : "✓"}
        </span>
      </div>

      <h1 className="mt-6 text-2xl font-bold">
        {result.alreadyChecked ? "이미 체크인됨" : "체크인 완료"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{reg.battleTitle}</p>
      <p className="mt-4 text-lg font-medium">{result.nickname ?? "(닉네임 없음)"}</p>
      <p className="mt-1 text-xs text-muted-foreground">{result.categoryName}</p>

      <Link
        href={`/battles/${reg.battleSlug}/admin`}
        className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black"
      >
        관리 페이지로
      </Link>
    </div>
  );
}

function Message({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-10 text-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
