export type DanceGenre =
  | "bboying"
  | "popping"
  | "locking"
  | "hiphop"
  | "house"
  | "krump"
  | "waacking"
  | "voguing"
  | "allstyle"
  | "mixed";

export type BattleFormat =
  | "1v1"
  | "2v2"
  | "3v3"
  | "4v4"
  | "5v5"
  | "7toSmoke"
  | "crewBattle"
  | "showcase"
  | "cypher";

export type BattleStatus = "upcoming" | "registration" | "ongoing" | "finished" | "cancelled";

export type Region =
  | "seoul"
  | "gyeonggi"
  | "incheon"
  | "busan"
  | "daegu"
  | "daejeon"
  | "gwangju"
  | "ulsan"
  | "sejong"
  | "gangwon"
  | "chungbuk"
  | "chungnam"
  | "jeonbuk"
  | "jeonnam"
  | "gyeongbuk"
  | "gyeongnam"
  | "jeju"
  | "online";

export interface Venue {
  name: string;
  address: string;
  region: Region;
  mapUrl?: string;
}

export interface PrizeTier {
  rank: string;
  amount?: number;
  note?: string;
}

export interface BattleLink {
  label: string;
  url: string;
  type: "instagram" | "youtube" | "registration" | "official" | "tiktok" | "other";
}

export interface BattleResult {
  rank: number;
  dancer?: string;
  crew?: string;
}

export interface Battle {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  endDate?: string;
  registrationDeadline?: string;
  genres: DanceGenre[];
  formats: BattleFormat[];
  status: BattleStatus;
  venue: Venue;
  organizer: string;
  judges?: string[];
  prize?: PrizeTier[];
  entryFee?: number;
  posterUrl?: string;
  links: BattleLink[];
  results?: BattleResult[];
  tags?: string[];
}
