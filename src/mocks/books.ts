import aquarium from "@/assets/images/books/aquarium.jpg";
import contradiction from "@/assets/images/books/contradiction.jpg";
import lightSpeed from "@/assets/images/books/light-speed.jpg";
import orbit from "@/assets/images/books/orbit.jpg";
import rapidCurrent from "@/assets/images/books/rapid-current.jpg";
import shell from "@/assets/images/books/shell.jpg";
import transparentSpiral from "@/assets/images/books/transparent-spiral.jpg";
import unbearableLightness from "@/assets/images/books/unbearable-lightness.jpg";

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
  genre?: string[];
  rating?: number;
  reviewCount?: number;
  description?: string;
  status?: "reading" | "completed";
  readCount?: number;
  hasReview?: boolean;
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
    coverUrl: aquarium,
    currentPage: 150,
    totalPages: 300,
    status: "reading",
    genre: ["소설", "한국문학"],
    isInLibrary: true,
  },
  {
    id: 3,
    title: "궤도",
    author: "박소영",
    publisher: "이지북",
    publishedAt: "2024.03.20",
    coverUrl: orbit,
    currentPage: 42,
    totalPages: 240,
    status: "reading",
    isInLibrary: true,
  },
  {
    id: 4,
    title: "참을 수 없는 존재의 가벼움",
    author: "밀란 쿤데라",
    publisher: "민음사",
    publishedAt: "2018.06.20",
    coverUrl: unbearableLightness,
    currentPage: 300,
    totalPages: 300,
    status: "completed",
    readCount: 2,
    hasReview: true,
    genre: ["소설", "세계문학"],
    isInLibrary: true,
  },
  {
    id: 5,
    title: "모순",
    author: "양귀자",
    publisher: "쓰다",
    publishedAt: "2013.04.01",
    coverUrl: contradiction,
    currentPage: 308,
    totalPages: 308,
    status: "completed",
    readCount: 1,
    isInLibrary: true,
  },
  {
    id: 6,
    title: "우리가 빛의 속도로 갈 수 없다면",
    author: "김초엽",
    publisher: "허블",
    publishedAt: "2019.06.24",
    coverUrl: lightSpeed,
    genre: ["소설", "한국문학"],
    rating: 4.3,
    reviewCount: 1234,
    description:
      "우리가 빛의 속도로 갈 수 없다면은 가까운 미래를 배경으로, 과학과 인간의 감성이 만나는 지점을 섬세하게 그려낸 김초엽 작가의 첫 소설집입니다.\n\n낯설지만 가능한 세계를 통해, 지금 여기의 우리가 서로를 어떻게 더 깊이 이해할 수 있을지 묻는다.\n\nSF라는 장르 안에서 사랑, 상실, 연대, 그리고 다시 만날 가능성에 대한 이야기가 따뜻하고 아름다운 언어로 펼쳐진다.",
    hasReview: true,
    isInLibrary: true,
  },
  {
    id: 7,
    title: "투명한 나선",
    author: "히가시노 게이고",
    publisher: "북다",
    publishedAt: "2026.07.13",
    coverUrl: transparentSpiral,
    genre: ["소설", "추리"],
    description:
      "하나의 사건에서 시작된 추적이 감춰진 관계와 과거로 이어집니다. 진실을 좇는 과정 속에서 인물들의 선택과 비밀을 만나는 추리 소설입니다.",
    isInLibrary: false,
  },
  {
    id: 8,
    title: "급류",
    author: "정대건",
    publisher: "민음사",
    publishedAt: "2022.12.22",
    coverUrl: rapidCurrent,
    genre: ["소설", "한국문학"],
    description:
      "서로의 삶에 깊이 스며든 두 사람의 이야기. 거센 물살 같은 시간 속에서 사랑과 상처, 그리고 다시 살아가는 마음을 따라갑니다.",
    isInLibrary: false,
  },
  {
    id: 9,
    title: "양면의 조개껍데기",
    author: "김초엽",
    publisher: "래빗홀",
    publishedAt: "2025.08.27",
    coverUrl: shell,
    genre: ["소설", "한국문학"],
    description:
      "서로 다른 세계를 마주하는 인물들을 통해 관계와 이해의 가능성을 살펴보는 김초엽의 소설입니다.",
    isInLibrary: false,
  },
];
