"use server";

import { redirect } from "next/navigation";
import { getCurrentAuthUser, getSupabaseServerClient } from "@/lib/supabase/server";
import { deleteUserAccount } from "@/lib/users";

/**
 * 회원 탈퇴 액션 — 본인 인증 후 데이터 삭제 + 로그아웃 + 홈 redirect.
 *
 * 보안:
 * - 폼 confirmation에 본인 이메일 정확히 입력 필수 (오작동 방어)
 * - server action이라 CSRF 자동 방어 (Next.js)
 */
export async function deleteAccount(
  formData: FormData,
): Promise<{ ok: false; error: string } | undefined> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login");

  const confirmEmail = String(formData.get("confirmEmail") ?? "")
    .trim()
    .toLowerCase();
  const userEmail = (authUser.email ?? "").trim().toLowerCase();

  if (!userEmail) {
    return { ok: false, error: "이메일이 없는 계정입니다. 운영자 문의." };
  }

  if (confirmEmail !== userEmail) {
    return {
      ok: false,
      error: "이메일이 일치하지 않습니다. 정확히 입력해주세요.",
    };
  }

  const result = await deleteUserAccount(authUser.id);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  // 세션 종료
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();

  redirect("/?deleted=1");
}
