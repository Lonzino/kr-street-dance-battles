import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
}
