import type { SentenceItem, WordItem } from "@/types/vocabulary";
import VocabularyMenu from "./VocabularyMenu";

type Props = {
  item: WordItem | SentenceItem;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onDetail: () => void;
  onDelete: () => void;
};
export default function VocabularyItem({
  item,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onDetail,
  onDelete,
}: Props) {
  const word = "word" in item;
  return (
    <div className="grid min-h-[89px] grid-cols-[69px_minmax(0,1fr)] border-b border-dashed border-[#DDD7D1]">
      <div className="border-r border-[#D2B4A3] pt-3 text-center text-xs text-[#B6ADA8]">
        {item.page}p
      </div>
      <div className="relative py-3 pr-4 pl-[22px]">
        <h2 className="pr-6 font-serif text-[18px] leading-6 text-[#392620]">
          {word ? item.word : item.content}
        </h2>
        {word && (
          <p className="mt-0.5 font-serif text-[14px] leading-5 text-[#6A5750]">{item.meaning}</p>
        )}
        <p className="mt-2 text-xs font-medium text-[#B7AFAA]">{item.bookTitle}</p>
        <VocabularyMenu
          label={word ? item.word : item.content}
          open={menuOpen}
          onToggle={onToggleMenu}
          onClose={onCloseMenu}
          onDetail={onDetail}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
