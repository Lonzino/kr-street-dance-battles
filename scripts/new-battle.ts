#!/usr/bin/env tsx
/**
 * new-battle — 배틀 slug 생성기 + 인터랙티브 엔트리 추가
 *
 * 사용:
 *   npm run new:battle                      # 인터랙티브 전체 입력
 *   npm run new:battle "2026 LINE UP S11"   # 제목으로 slug 제안
 *   npm run new:battle -- --dry             # 파일에 안 쓰고 JSON만 출력
 *
 * 역할:
 *   1) 제목 → slug 제안 (영문 전사, 소문자, 하이픈, 연도 접미)
 *   2) 필수 필드 순서대로 프롬프트
 *   3) Zod 검증 후 battles.json에 push
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline/promises";
import { Battle, BattleArray } from "../src/schema/index.js";

const BATTLES_PATH = path.join(process.cwd(), "src/data/battles.json");

// ────────────────────────────────────────────────
// slug 생성
// ────────────────────────────────────────────────

/**
 * 제목을 소문자·하이픈·영문 전사 slug로 변환.
 * 한글은 일단 드롭 (또는 영문 힌트 찾으라고 요청).
 * 연도 발견 시 접미로 이동.
 */
function titleToSlug(title: string): string {
  // 연도 추출 (4자리)
  const yearMatch = title.match(/\b(19|20|21)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : "";
  const titleNoYear = year ? title.replace(year, "") : title;

  // 영숫자·하이픈·공백만 남기기 (한글은 제거됨 → 영문 힌트 필요)
  const cleaned = titleNoYear
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return year ? `${cleaned}-${year}` : cleaned;
}

// ────────────────────────────────────────────────
// 프롬프트 유틸
// ────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function ask(q: string, defaultVal?: string): Promise<string> {
  const prompt = defaultVal ? `${q} [${defaultVal}]: ` : `${q}: `;
  const answer = (await rl.question(prompt)).trim();
  return answer || defaultVal || "";
}

async function askRequired(q: string): Promise<string> {
  while (true) {
    const v = (await rl.question(`${q}: `)).trim();
    if (v) return v;
    console.log("  ↑ 필수입니다");
  }
}

async function askChoice<T extends string>(q: string, choices: readonly T[]): Promise<T> {
  console.log(q);
  for (const [i, c] of choices.entries()) {
    console.log(`  ${i + 1}) ${c}`);
  }
  while (true) {
    const n = parseInt((await rl.question("번호 선택: ")).trim(), 10);
    if (n >= 1 && n <= choices.length) return choices[n - 1];
    console.log("  ↑ 유효한 번호를 입력하세요");
  }
}

async function askMulti<T extends string>(q: string, choices: readonly T[]): Promise<T[]> {
  console.log(q, "(콤마로 여러 개, 예: 1,3,5)");
  for (const [i, c] of choices.entries()) {
    console.log(`  ${i + 1}) ${c}`);
  }
  while (true) {
    const raw = (await rl.question("번호들: ")).trim();
    if (!raw) return [];
    const nums = raw.split(",").map((s) => parseInt(s.trim(), 10));
    if (nums.every((n) => n >= 1 && n <= choices.length)) {
      return nums.map((n) => choices[n - 1]);
    }
    console.log("  ↑ 유효한 번호들로 다시");
  }
}

// ────────────────────────────────────────────────
// 메인
// ────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry");
  const titleArg = argv.filter((a) => !a.startsWith("--")).join(" ");

  console.log("\n🔥 새 배틀 엔트리 추가\n");

  const title = titleArg || (await askRequired("대회명 (영문 우선, 한글 OK)"));
  const proposedSlug = titleToSlug(title);
  console.log(`\n💡 제안 slug: ${proposedSlug || "(자동 생성 실패 — 직접 입력 필요)"}`);
  const slug = (
    await ask("slug (Enter로 제안 수락)", proposedSlug || "enter-manually")
  ).toLowerCase();

  // 기존 slug 중복 체크
  const existing = JSON.parse(fs.readFileSync(BATTLES_PATH, "utf8")) as Array<{ slug: string }>;
  if (existing.some((b) => b.slug === slug)) {
    console.error(`\n❌ slug "${slug}"가 이미 존재합니다. 다른 slug로 재시도.`);
    rl.close();
    process.exit(1);
  }

  // 필수 필드
  const subtitle = await ask("부제 (선택, Enter=skip)");
  const description = await ask("소개 (선택)");
  const date = await askRequired("개최일 (YYYY-MM-DD)");
  const endDate = await ask("종료일 (YYYY-MM-DD, 선택)");
  const deadline = await ask("접수 마감일 (YYYY-MM-DD, 선택)");

  const genres = await askMulti("장르", [
    "bboying",
    "popping",
    "locking",
    "hiphop",
    "house",
    "krump",
    "waacking",
    "voguing",
    "allstyle",
    "mixed",
  ] as const);
  if (genres.length === 0) {
    console.error("\n❌ 장르 최소 1개 필수");
    rl.close();
    process.exit(1);
  }

  const formats = await askMulti("배틀 포맷", [
    "1v1",
    "2v2",
    "3v3",
    "4v4",
    "5v5",
    "7toSmoke",
    "crewBattle",
    "showcase",
    "cypher",
  ] as const);
  if (formats.length === 0) {
    console.error("\n❌ 포맷 최소 1개 필수");
    rl.close();
    process.exit(1);
  }

  const status = await askChoice("상태", [
    "registration",
    "upcoming",
    "ongoing",
    "finished",
    "cancelled",
  ] as const);

  console.log("\n── 장소 ──");
  const venueName = await askRequired("장소명");
  const venueAddress = await askRequired("주소");
  const region = await askChoice("지역", [
    "seoul",
    "gyeonggi",
    "incheon",
    "busan",
    "daegu",
    "daejeon",
    "gwangju",
    "ulsan",
    "sejong",
    "gangwon",
    "chungbuk",
    "chungnam",
    "jeonbuk",
    "jeonnam",
    "gyeongbuk",
    "gyeongnam",
    "jeju",
    "online",
  ] as const);

  const organizer = await askRequired("주최/주관");

  console.log("\n── 링크 (최소 1개 권장) ──");
  const linkLabel = await ask("링크 라벨 (선택)");
  const linkUrl = linkLabel ? await askRequired("링크 URL") : "";
  const linkType = linkLabel
    ? await askChoice("링크 타입", [
        "instagram",
        "youtube",
        "registration",
        "official",
        "tiktok",
        "other",
      ] as const)
    : "other";

  // 빌드
  const entry: Record<string, unknown> = {
    slug,
    title,
    date,
    genres,
    formats,
    status,
    venue: { name: venueName, address: venueAddress, region },
    organizer,
    links: linkLabel ? [{ label: linkLabel, url: linkUrl, type: linkType }] : [],
  };
  if (subtitle) entry.subtitle = subtitle;
  if (description) entry.description = description;
  if (endDate) entry.endDate = endDate;
  if (deadline) entry.registrationDeadline = deadline;

  // Zod 검증 (Battle 스키마)
  const result = Battle.safeParse(entry);
  if (!result.success) {
    console.error("\n❌ 스키마 검증 실패:");
    console.error(result.error.format());
    rl.close();
    process.exit(1);
  }

  console.log("\n✅ 검증 통과. 엔트리:\n");
  console.log(JSON.stringify(result.data, null, 2));

  if (dryRun) {
    console.log("\n--dry 모드 — 파일 수정 안 함.");
    rl.close();
    return;
  }

  const confirm = (await ask("\nbattles.json에 추가할까요? (y/N)")).toLowerCase();
  if (confirm !== "y") {
    console.log("취소됨.");
    rl.close();
    return;
  }

  // append + 전체 재검증
  const all = JSON.parse(fs.readFileSync(BATTLES_PATH, "utf8"));
  all.push(result.data);
  const validated = BattleArray.safeParse(all);
  if (!validated.success) {
    console.error("\n❌ 전체 배열 검증 실패:", validated.error.format());
    rl.close();
    process.exit(1);
  }
  fs.writeFileSync(BATTLES_PATH, `${JSON.stringify(validated.data, null, 2)}\n`, "utf8");

  console.log(`\n✅ ${slug} 추가 완료. 다음:`);
  console.log("  npm run validate-data  # 재검증");
  console.log("  git add src/data/battles.json");
  console.log(`  git commit -m "data: ${title} 추가"`);

  rl.close();
}

main().catch((e) => {
  console.error("\n💥 예외:", e);
  rl.close();
  process.exit(1);
});
