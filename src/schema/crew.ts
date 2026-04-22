import { z } from "zod";
import { DanceGenre, Region } from "./enums";

export const Crew = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  koreanName: z.string().optional(),
  foundedYear: z.number().int().min(1970).max(2100).optional(),
  region: Region,
  genres: z.array(DanceGenre).min(1),
  leader: z.string().optional(),
  members: z.array(z.string()).optional(),
  description: z.string().optional(),
  instagramUrl: z.url().optional(),
  youtubeUrl: z.url().optional(),
  tags: z.array(z.string()).optional(),
});
export type Crew = z.infer<typeof Crew>;

export const CrewArray = z.array(Crew);
