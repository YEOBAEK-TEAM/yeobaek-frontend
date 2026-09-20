// 책갈피 페이지 범위 표기
export const formatPageRange = (startPage: number, endPage: number) =>
  startPage === endPage ? `${startPage}p` : `${startPage}p - ${endPage}p`;
