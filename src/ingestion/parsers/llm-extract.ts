import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { Battle } from "@/schema";

/**
 * LLM 추출기.
 *
 * 입력: 비정형 텍스트 (인스타 캡션, 뉴스 본문 등)
 * 출력: 부분적으로 채워진 Battle 객체 + confidence + warnings
 *
 * 검증되지 않은 필드는 운영자가 수동 보완. published 전 반드시 검토.
 */

const PartialBattle = Battle.partial();
const ExtractionSchema = z.object({
  battle: PartialBattle,
  confidence: z.number().min(0).max(1),
  warnings: z.array(z.string()),
});
export type ExtractionResult = z.infer<typeof ExtractionSchema>;

const SYSTEM_PROMPT = `당신은 한국 스트릿 댄스 배틀 정보 추출 전문가입니다.

주어진 텍스트에서 배틀 정보를 추출해 JSON으로 반환하세요.

규칙:
1. 추론하지 말고 텍스트에 명시된 것만 추출. 없으면 필드 생략.
2. 날짜는 YYYY-MM-DD ISO 형식. 연도 모르면 생략.
3. 장르는 다음 enum만 사용: bboying, popping, locking, hiphop, house, krump, waacking, voguing, allstyle, mixed.
4. 포맷은: 1v1, 2v2, 3v3, 4v4, 5v5, 7toSmoke, crewBattle, showcase, cypher.
5. 지역은: seoul, gyeonggi, incheon, busan, daegu, daejeon, gwangju, ulsan, sejong, gangwon, chungbuk, chungnam, jeonbuk, jeonnam, gyeongbuk, gyeongnam, jeju, online.
6. confidence는 0.0~1.0 (텍스트가 명확하면 0.9+, 추측이 많으면 0.5-).
7. 추측·불확실한 필드는 warnings에 사유 명시.
8. slug는 영소문자+대시. 예: "r16-korea-2026".

반드시 JSON만 출력. 다른 텍스트 없이.`;

export interface LlmExtractOptions {
  apiKey?: string;
  model?: string;
  cacheSystemPrompt?: boolean;
}

export async function extractBattleFromText(
  text: string,
  opts: LlmExtractOptions = {},
): Promise<ExtractionResult> {
  const apiKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY가 설정되지 않았습니다.");
  }

  const client = new Anthropic({ apiKey });
  const model = opts.model ?? "claude-sonnet-4-6";

  const response = await client.messages.create({
    model,
    max_tokens: 1500,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        ...(opts.cacheSystemPrompt !== false ? { cache_control: { type: "ephemeral" } } : {}),
      },
    ],
    messages: [
      {
        role: "user",
        content: `다음 텍스트에서 배틀 정보를 추출하세요.\n\n---\n${text}\n---\n\n결과 JSON 형식:\n{\n  "battle": { ... 추출된 필드 ... },\n  "confidence": 0.0~1.0,\n  "warnings": ["..."]\n}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("LLM 응답이 비어있음");
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("LLM 응답에서 JSON을 찾지 못함: " + textBlock.text.slice(0, 200));
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return ExtractionSchema.parse(parsed);
}
