/**
 * Crawlers that collect pages to train or feed AI models, plus common
 * scraping libraries. robots.txt asks the well-behaved ones to stay out
 * (app/robots.ts); the proxy refuses all of them outright, since robots.txt
 * is only a request. Search engines (Googlebot, Bingbot, ...) are not on this
 * list, so the site still shows up in normal search results.
 *
 * Google-Extended and Applebot-Extended are robots.txt-only tokens: Google and
 * Apple crawl with their normal bots and read these to decide whether the
 * pages may be used for AI training.
 */
export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "GoogleOther",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "meta-externalfetcher",
  "FacebookBot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Timpibot",
  "PetalBot",
  "PanguBot",
  "Kangaroo Bot",
  "iaskspider",
  "Webzio-Extended",
  "img2dataset",
] as const;

/** Scraping libraries that identify themselves; refused by the proxy only. */
const SCRAPER_AGENTS = ["Scrapy", "python-requests", "python-urllib", "aiohttp", "httpx"];

const BLOCKED = new RegExp(
  [...AI_CRAWLERS, ...SCRAPER_AGENTS]
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "i",
);

/** True for a User-Agent that belongs to an AI crawler or a scraping library. */
export function isBlockedCrawler(userAgent: string | null): boolean {
  return Boolean(userAgent && BLOCKED.test(userAgent));
}
