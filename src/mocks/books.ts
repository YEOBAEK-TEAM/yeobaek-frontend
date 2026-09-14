export type Book = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  coverUrl: string;
  pdfUrl?: string;
  currentPage?: number;
  totalPages?: number;
  isInLibrary: boolean;
};

export const books: Book[] = [
  {
    id: 1,
    title: "어린 왕자",
    author: "앙투안 드 생텍쥐페리",
    publisher: "열린책들",
    publishedAt: "2015.10.20",
    coverUrl: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791164455300.jpg?t=2981240",
    pdfUrl: "/books/little-prince.pdf",
    currentPage: 18,
    totalPages: 77,
    isInLibrary: true,
  },
  {
    id: 2,
    title: "수족관",
    author: "유혜영",
    publisher: "R",
    publishedAt: "2024.01.10",
    coverUrl: "/books/covers/aquarium.jpg",
    currentPage: 142,
    totalPages: 316,
    isInLibrary: true,
  },
  {
    id: 3,
    title: "궤도",
    author: "박소영",
    publisher: "이지북",
    publishedAt: "2024.03.20",
    coverUrl: "/books/covers/orbit.jpg",
    isInLibrary: true,
  },
  {
    id: 4,
    title: "참을 수 없는 존재의 가벼움",
    author: "밀란 쿤데라",
    publisher: "민음사",
    publishedAt: "2018.06.20",
    coverUrl: "/books/covers/unbearable-lightness.jpg",
    isInLibrary: true,
  },
  {
    id: 5,
    title: "모순",
    author: "양귀자",
    publisher: "쓰다",
    publishedAt: "2013.04.01",
    coverUrl: "/books/covers/contradiction.jpg",
    isInLibrary: true,
  },
  {
    id: 6,
    title: "우리가 빛의 속도로 갈 수 없다면",
    author: "김초엽",
    publisher: "허블",
    publishedAt: "2019.06.24",
    coverUrl: "/books/covers/light-speed.jpg",
    isInLibrary: true,
  },
  {
    id: 7,
    title: "투명한 나선",
    author: "히가시노 게이고",
    publisher: "북다",
    publishedAt: "2026.07.13",
    coverUrl: "/books/covers/transparent-spiral.jpg",
    isInLibrary: false,
  },
  {
    id: 8,
    title: "급류",
    author: "정대건",
    publisher: "민음사",
    publishedAt: "2022.12.22",
    coverUrl: "/books/covers/rapid-current.jpg",
    isInLibrary: false,
  },
  {
    id: 9,
    title: "양면의 조개껍데기",
    author: "김초엽",
    publisher: "래빗홀",
    publishedAt: "2025.08.27",
    coverUrl: "/books/covers/shell.jpg",
    isInLibrary: false,
  },
];
