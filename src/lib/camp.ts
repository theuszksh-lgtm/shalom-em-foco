export const CAMP_DAYS = [
  { day: 1, date: "11 de janeiro", weekday: "Dia 1" },
  { day: 2, date: "12 de janeiro", weekday: "Dia 2" },
  { day: 3, date: "13 de janeiro", weekday: "Dia 3" },
  { day: 4, date: "14 de janeiro", weekday: "Dia 4" },
  { day: 5, date: "15 de janeiro", weekday: "Dia 5" },
] as const;

export type CampDay = 1 | 2 | 3 | 4 | 5;
export const isCampDay = (n: unknown): n is CampDay =>
  typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 5;
