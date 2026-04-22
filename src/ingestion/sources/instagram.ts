import type { FetchedSource, SourceAdapter } from "./types";

/**
 * Instagram 어댑터.
 *
 * 전략: 공개 oEmbed (인증 없이 캡션 일부 추출 가능) → 부족하면 사용자 제출 캡션 사용.
 *
 * 한계: oEmbed는 캡션 전체를 주지 않을 수 있고, 비공개 계정은 못 가져옴.
 *       프로덕션에선 (1) 사용자가 직접 캡션 붙여넣기 또는 (2) 본인 계정 Graph API.
 */
export const instagramAdapter: SourceAdapter = {
  match(url) {
    return /^https?:\/\/(www\.)?instagram\.com\//.test(url);
  },

  async fetch(url): Promise<FetchedSource> {
    const sourceId = extractIgPostId(url) ?? url;

    // oEmbed: 공식 API는 토큰 필요. 우선 페이지 메타 태그 fallback.
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KRSDBBot/0.1)" },
    });
    const html = await res.text();
    const description = extractMeta(html, "og:description") ?? "";
    const title = extractMeta(html, "og:title") ?? "";

    return {
      sourceType: "instagram",
      sourceUrl: url,
      sourceId,
      rawContent: [title, description].filter(Boolean).join("\n\n"),
      rawMetadata: { fetchStrategy: "og-meta" },
    };
  },
};

function extractIgPostId(url: string): string | null {
  const m = url.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/);
  return m ? m[2] : null;
}

function extractMeta(html: string, property: string): string | null {
  const re = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i");
  const m = html.match(re);
  return m ? decodeHtmlEntities(m[1]) : null;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
