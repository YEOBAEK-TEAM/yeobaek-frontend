const pad = (value: number) => String(value).padStart(2, "0");

const isSameDate = (left: Date, right: Date) => left.toDateString() === right.toDateString();

// 오늘은 시각, 어제는 '어제', 그 이전은 날짜 표기
export const formatLastVisited = (isoDate: string, now = new Date()) => {
  const date = new Date(isoDate);

  if (isSameDate(date, now)) return `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDate(date, yesterday)) return "어제";

  return `${date.getMonth() + 1}.${date.getDate()}`;
};
