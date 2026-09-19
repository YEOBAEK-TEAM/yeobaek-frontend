import type { ReadingDay } from "@/types/my";
export const dateLabel = (date: string) => date.slice(0, 10).replaceAll("-", ".");
export const dayPages = (day: ReadingDay) =>
  day.sessions.reduce((total, session) => total + session.endPage - session.page + 1, 0);
export function monthSummary(days: ReadingDay[]) {
  const pages = days.reduce((total, day) => total + dayPages(day), 0);
  const sessions = days.flatMap((day) => day.sessions);
  return {
    pages,
    days: days.length,
    average: days.length ? Math.round(pages / days.length) : 0,
    minutes: sessions.reduce((sum, session) => sum + session.minutes, 0),
    completed: new Set(
      sessions.filter((session) => session.completed).map((session) => session.bookId),
    ).size,
  };
}
