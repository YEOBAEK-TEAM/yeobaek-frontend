import { useBottomSheetClose } from "@/components/common/bottomSheet/bottomSheetContext";
import TasteBookCard from "@/components/home/taste/TasteBookCard";
import { TASTE_SHEET_TITLE } from "@/constants/home/home";

import type { TasteBook } from "@/types/home/home";

type TasteTopSheetContentProps = {
  books: TasteBook[];
  onSelect: (bookId: number) => void;
};

export default function TasteTopSheetContent({ books, onSelect }: TasteTopSheetContentProps) {
  const requestClose = useBottomSheetClose();

  return (
    <>
      <h2
        id="taste-sheet-title"
        className="border-b border-[#EAE7E1] px-5 pt-1 pb-5 text-center text-[17px] font-bold text-[#4F4D4E]"
      >
        {TASTE_SHEET_TITLE}
      </h2>

      <ul className="flex flex-col gap-3 px-5 py-5">
        {books.map((book) => (
          <li key={book.bookId}>
            {/* 시트 닫은 뒤 도서 상세 이동 */}
            <TasteBookCard
              book={book}
              onSelect={(bookId) => requestClose(() => onSelect(bookId))}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
