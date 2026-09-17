// 작성일 표기 변환
export const formatReportDate = (date: string) => date.slice(0, 10).replaceAll("-", ".");
