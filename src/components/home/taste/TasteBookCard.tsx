import { ChevronRight } from "lucide-react";

import type { TasteBook } from "@/types/home/home";

type TasteBookCardProps = {
  book: TasteBook;
  onSelect: (bookId: number) => void;
};

export default function TasteBookCard({ book, onSelect }: TasteBookCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(book.bookId)}
      // 목록 카드 눌림 상태
      className="flex w-full items-center gap-3 rounded-2xl border border-[#C4BFB6] bg-white p-3 text-left active:border-[#BCB7AD] active:bg-[#E7E2DC]"
    >
      <img src={book.coverUrl} alt="" className="h-19 w-13 shrink-0 rounded-sm object-cover" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] font-bold text-[#4F4D4E]">{book.title}</p>

        <p className="mt-0.5 truncate text-[15px] text-[#8F8F8F]">{book.author}</p>

        <p className="mt-1 text-[13px] text-[#8F8F8F]">
          {book.publisher} <span className="px-1">|</span> {book.publishedAt}
        </p>
      </div>

      <ChevronRight aria-hidden="true" className="h-6 w-6 shrink-0 text-[#8F8F8F]" />
    </button>
  );
}
