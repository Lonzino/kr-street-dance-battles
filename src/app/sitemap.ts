import type { MetadataRoute } from "next";
import { getAllBattles, getAllCrews } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kr-street-dance-battles.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/crews`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const battlePaths: MetadataRoute.Sitemap = getAllBattles().map((b) => ({
    url: `${SITE_URL}/battles/${b.slug}`,
    lastModified: now,
    changeFrequency: b.status === "finished" ? "yearly" : "weekly",
    priority: b.status === "registration" ? 0.9 : 0.6,
  }));

  const crewPaths: MetadataRoute.Sitemap = getAllCrews().map((c) => ({
    url: `${SITE_URL}/crews/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPaths, ...battlePaths, ...crewPaths];
}
