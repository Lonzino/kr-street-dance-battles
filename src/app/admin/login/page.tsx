import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_MAX_AGE_S, COOKIE_NAME, checkPassword, createSessionToken } from "@/lib/auth";
import { rateLimitWithCleanup } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");

    // Rate limit: IP당 5회/분 (인메모리, best-effort)
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "unknown";
    const rl = rateLimitWithCleanup(`login:${ip}`, { limit: 5, windowMs: 60_000 });

    if (!rl.ok) {
      const params = new URLSearchParams();
      if (sp.from) params.set("from", sp.from);
      params.set("error", "rate_limit");
      redirect(`/admin/login?${params.toString()}`);
    }

    const ok = await checkPassword(password);
    if (!ok) {
      const params = new URLSearchParams();
      if (sp.from) params.set("from", sp.from);
      params.set("error", "1");
      redirect(`/admin/login?${params.toString()}`);
    }
    const token = await createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_S,
    });
    redirect(sp.from && sp.from.startsWith("/admin") ? sp.from : "/admin");
  }

  const errorMessage =
    sp.error === "rate_limit"
      ? "시도가 너무 많습니다. 1분 후 다시 시도해주세요."
      : sp.error
        ? "비밀번호가 틀렸습니다."
        : null;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm items-center px-4">
      <form action={login} className="w-full space-y-4">
        <h1 className="text-2xl font-bold">관리자 로그인</h1>
        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="비밀번호"
          className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
        {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          로그인
        </button>
        <p className="text-xs text-muted-foreground">
          비밀번호는 <code className="rounded bg-muted px-1 py-0.5">.env.local</code>의{" "}
          <code className="rounded bg-muted px-1 py-0.5">ADMIN_PASSWORD</code>.
        </p>
      </form>
    </div>
  );
}
