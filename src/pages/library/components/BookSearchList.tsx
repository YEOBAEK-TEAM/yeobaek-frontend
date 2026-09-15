import type { Book } from "@/mocks/books";
import BookSearchItem from "./BookSearchItem";

type BookSearchListProps = { books: Book[]; fromSearch: string };

export default function BookSearchList({ books, fromSearch }: BookSearchListProps) {
  return (
    <div className="border-t border-[#999999] px-4 pt-6">
      {books.length > 0 ? (
        <ul aria-label="도서 검색 결과" className="space-y-5">
          {books.map((book) => (
            <li key={book.id}>
              <BookSearchItem book={book} fromSearch={fromSearch} />
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="py-12 text-center text-[#77746D]">
          검색 결과가 없습니다.
        </p>
      )}
    </div>
  );
}
