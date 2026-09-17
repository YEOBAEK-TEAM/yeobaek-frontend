// 서버 값이 없을 때 현재 페이지로 진행률 계산
export const calculateProgress = (currentPage: number, totalPages: number) => {
  if (totalPages <= 0) return { percent: 0, remainingPages: 0 };

  return {
    percent: Math.min(100, Math.round((currentPage / totalPages) * 100)),
    remainingPages: Math.max(0, totalPages - currentPage),
  };
};
