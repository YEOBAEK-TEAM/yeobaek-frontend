import { Link } from "react-router-dom";
import type { Book } from "@/mocks/books";
import { ChevronIcon } from "./LibraryIcons";

type BookSearchItemProps = { book: Book; fromSearch: string };

export default function BookSearchItem({ book, fromSearch }: BookSearchItemProps) {
  return (
    <Link
      to={`/library/books/${book.id}`}
      state={{ fromSearch }}
      className="flex h-29 items-center gap-4 rounded-3xl border border-[#999999] px-3 py-2.5"
    >
      <img
        src={book.coverUrl}
        alt={`${book.title} 표지`}
        className="h-23 w-16 shrink-0 rounded-xl object-contain"
      />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xl font-semibold">{book.title}</h2>
        <p className="mt-1 truncate text-sm text-[#96938D]">{book.author}</p>
        <p className="truncate text-sm text-[#96938D]">
          {book.publisher} | {book.publishedAt}
        </p>
      </div>
      <span className="shrink-0 text-[#96938D]">
        <ChevronIcon />
      </span>
    </Link>
  );
}
