export type Book = {
  id: number;
  title: string;
  author: string;
  pdfUrl: string;
};

export const books: Book[] = [
  {
    id: 1,
    title: "어린 왕자",
    author: "앙투안 드 생텍쥐페리",
    pdfUrl: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791164455300.jpg?t=2981240",
  },
];
