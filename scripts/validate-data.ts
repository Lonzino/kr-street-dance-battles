/**
 * JSON 데이터 무결성 검증.
 * CI에서 실행하면 PR로 들어온 데이터 변경이 스키마와 어긋날 때 빌드 실패.
 */
import battlesJson from "../src/data/battles.json";
import crewsJson from "../src/data/crews.json";
import { BattleArray, CrewArray } from "../src/schema";

let hasError = false;

const b = BattleArray.safeParse(battlesJson);
if (b.success) {
  console.log(`✓ battles.json: ${b.data.length} entries valid`);
} else {
  console.error(`✗ battles.json invalid:`);
  console.error(JSON.stringify(b.error.issues, null, 2));
  hasError = true;
}

const c = CrewArray.safeParse(crewsJson);
if (c.success) {
  console.log(`✓ crews.json: ${c.data.length} entries valid`);
} else {
  console.error(`✗ crews.json invalid:`);
  console.error(JSON.stringify(c.error.issues, null, 2));
  hasError = true;
}

if (b.success) {
  const slugs = b.data.map((x) => x.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length > 0) {
    console.error(`✗ duplicate battle slugs: ${dupes.join(", ")}`);
    hasError = true;
  }
}

if (c.success) {
  const slugs = c.data.map((x) => x.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length > 0) {
    console.error(`✗ duplicate crew slugs: ${dupes.join(", ")}`);
    hasError = true;
  }
}

process.exit(hasError ? 1 : 0);
