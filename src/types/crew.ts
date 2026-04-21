import type { DanceGenre, Region } from "./battle";

export interface Crew {
  slug: string;
  name: string;
  koreanName?: string;
  foundedYear?: number;
  region: Region;
  genres: DanceGenre[];
  leader?: string;
  members?: string[];
  description?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tags?: string[];
}
