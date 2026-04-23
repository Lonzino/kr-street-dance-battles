import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllBattles, getAllCrews } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/crews`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const [battles, crews] = await Promise.all([getAllBattles(), getAllCrews()]);

  const battlePaths: MetadataRoute.Sitemap = battles.map((b) => ({
    url: `${SITE_URL}/battles/${b.slug}`,
    lastModified: now,
    changeFrequency: b.status === "finished" ? "yearly" : "weekly",
    priority: b.status === "registration" ? 0.9 : 0.6,
  }));

  const crewPaths: MetadataRoute.Sitemap = crews.map((c) => ({
    url: `${SITE_URL}/crews/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPaths, ...battlePaths, ...crewPaths];
}
