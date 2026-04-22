/**
 * CLI 수집 도구: pnpm ingest:url <URL or text>
 */
import "dotenv/config";
import { ingest } from "@/ingestion/pipeline";

async function main() {
  const input = process.argv.slice(2).join(" ").trim();
  if (!input) {
    console.error("사용법: pnpm ingest:url <URL_OR_TEXT>");
    process.exit(1);
  }

  console.log("[ingest] 입력:", input.slice(0, 100));
  const { recordId, confidence } = await ingest(input);
  console.log(`[ingest] 완료. record=${recordId}, confidence=${confidence.toFixed(2)}`);
  console.log("[ingest] 검토는 /admin 에서.");
  process.exit(0);
}

main().catch((err) => {
  console.error("[ingest] 실패:", err);
  process.exit(1);
});
