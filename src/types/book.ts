export type BookSearchResult = {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl: string;
  createdAt: string;
};

// 현재 Swagger의 상세 응답에는 bookId가 없어 URL의 ID를 사용합니다.
export type BookDetail = Omit<BookSearchResult, "bookId"> & {
  description: string;
  genre: string;
};

export type PopularBooksPage = {
  books: BookSearchResult[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};
