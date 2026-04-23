import type { FetchedSource, SourceAdapter } from "./types";

/**
 * Instagram 어댑터.
 *
 * 전략: 공개 페이지의 og:* 메타 태그에서 제목·캡션 추출.
 *
 * 한계:
 * - oEmbed 공식 API는 비즈니스 계정 + 토큰 필요 (장기 과제)
 * - IG는 봇 UA를 적극 차단하므로 로그인 페이지가 리턴될 수 있음
 * - 비공개 계정·삭제된 포스트는 가져올 수 없음
 *
 * 권장 운영: 사용자가 캡션을 직접 붙여넣는 manual adapter 흐름이 더 안정적.
 */
export const instagramAdapter: SourceAdapter = {
  match(url) {
    return /^https?:\/\/(www\.)?instagram\.com\//.test(url);
  },

  async fetch(url): Promise<FetchedSource> {
    const sourceId = extractIgPostId(url) ?? url;

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 10_000);

    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; KRSDBBot/0.1; +https://github.com/Lonzino/kr-street-dance-battles)",
          Accept: "text/html,*/*;q=0.8",
        },
      });

      if (!res.ok) {
        throw new Error(`Instagram fetch ${res.status} for ${url}`);
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("html")) {
        throw new Error(`Instagram returned non-HTML content-type: ${contentType}`);
      }

      const html = await res.text();
      const description = extractMeta(html, "og:description") ?? "";
      const title = extractMeta(html, "og:title") ?? "";

      const rawContent = [title, description].filter(Boolean).join("\n\n");
      if (!rawContent) {
        throw new Error("Instagram OG 메타 비어있음 (로그인 페이지일 가능성). 캡션 직접 붙여넣기 권장.");
      }

      return {
        sourceType: "instagram",
        sourceUrl: url,
        sourceId,
        rawContent,
        rawMetadata: { fetchStrategy: "og-meta" },
      };
    } finally {
      clearTimeout(timeout);
    }
  },
};

function extractIgPostId(url: string): string | null {
  const m = url.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/);
  return m ? m[2] : null;
}

function extractMeta(html: string, property: string): string | null {
  // 속성 순서에 무관하게: <meta>...property="..." ... content="...">
  // 두 가지 순서를 모두 처리
  const re1 = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    "i",
  );
  const m = html.match(re1) ?? html.match(re2);
  return m ? decodeHtmlEntities(m[1]) : null;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
