import type { SentenceItem, WordListItem } from "@/types/vocabulary";

import VocabularyMenu from "./VocabularyMenu";

type Props = {
  item: WordListItem | SentenceItem;
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
  const isWord = "word" in item;

  return (
    <div className="grid min-h-22 grid-cols-[69px_minmax(0,1fr)] border-b border-dashed border-[#DDD7D1]">
      {/* 페이지 */}
      <div className="border-r border-[#D2B4A3] px-2 pt-3 text-left text-xs text-[#B6ADA8]">
        {item.page}p
      </div>

      {/* 내용 */}
      <div className="relative py-3 pr-4 pl-5.5">
        <h2
          className={`pr-6 font-serif text-[#392620] ${
            isWord ? "text-lg leading-6" : "line-clamp-2 text-base leading-6"
          }`}
        >
          {isWord ? item.word : `“${item.content}”`}
        </h2>

        {/* 단어 뜻 */}
        {isWord && (
          <p className="mt-0.5 font-serif text-sm leading-5 text-[#6A5750]">{item.meaning}</p>
        )}

        {/* 책 제목 */}
        <p className="mt-2 text-xs font-medium text-[#B7AFAA]">{item.bookTitle}</p>

        {/* 더보기 메뉴 */}
        <VocabularyMenu
          label={isWord ? item.word : item.content}
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
