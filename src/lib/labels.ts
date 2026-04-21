import type { BattleFormat, BattleStatus, DanceGenre, Region } from "@/types";

export const genreLabel: Record<DanceGenre, string> = {
  bboying: "비보잉",
  popping: "팝핑",
  locking: "락킹",
  hiphop: "힙합",
  house: "하우스",
  krump: "크럼프",
  waacking: "왁킹",
  voguing: "보깅",
  allstyle: "올스타일",
  mixed: "혼합",
};

export const formatLabel: Record<BattleFormat, string> = {
  "1v1": "1vs1",
  "2v2": "2vs2",
  "3v3": "3vs3",
  "4v4": "4vs4",
  "5v5": "5vs5",
  "7toSmoke": "7 to Smoke",
  crewBattle: "크루 배틀",
  showcase: "쇼케이스",
  cypher: "사이퍼",
};

export const statusLabel: Record<BattleStatus, string> = {
  upcoming: "예정",
  registration: "접수중",
  ongoing: "진행중",
  finished: "종료",
  cancelled: "취소",
};

export const statusColor: Record<BattleStatus, string> = {
  upcoming: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  registration: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  ongoing: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  finished: "bg-neutral-500/20 text-neutral-400 border-neutral-500/40",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/40",
};

export const regionLabel: Record<Region, string> = {
  seoul: "서울",
  gyeonggi: "경기",
  incheon: "인천",
  busan: "부산",
  daegu: "대구",
  daejeon: "대전",
  gwangju: "광주",
  ulsan: "울산",
  sejong: "세종",
  gangwon: "강원",
  chungbuk: "충북",
  chungnam: "충남",
  jeonbuk: "전북",
  jeonnam: "전남",
  gyeongbuk: "경북",
  gyeongnam: "경남",
  jeju: "제주",
  online: "온라인",
};

export function formatDateKR(dateIso: string, endIso?: string): string {
  const d = new Date(dateIso);
  const base = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  if (!endIso) return base;
  const e = new Date(endIso);
  if (d.getTime() === e.getTime()) return base;
  return `${base} – ${String(e.getMonth() + 1).padStart(2, "0")}.${String(e.getDate()).padStart(2, "0")}`;
}

export function formatKRW(amount: number): string {
  if (amount >= 10000) {
    const man = Math.floor(amount / 10000);
    const rest = amount % 10000;
    if (rest === 0) return `${man.toLocaleString()}만원`;
    return `${man.toLocaleString()}만 ${rest.toLocaleString()}원`;
  }
  return `${amount.toLocaleString()}원`;
}
