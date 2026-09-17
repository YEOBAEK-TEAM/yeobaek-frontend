import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import TasteTopSheetContent from "@/components/home/taste/TasteTopSheetContent";

import type { TasteBook } from "@/types/home/home";

type TasteBookTopSheetProps = {
  books: TasteBook[];
  onSelect: (bookId: number) => void;
  onClose: () => void;
};

export default function TasteBookTopSheet({ books, onSelect, onClose }: TasteBookTopSheetProps) {
  return (
    <BottomSheet labelledBy="taste-sheet-title" onClose={onClose} panelClassName="bg-white">
      <TasteTopSheetContent books={books} onSelect={onSelect} />
    </BottomSheet>
  );
}
