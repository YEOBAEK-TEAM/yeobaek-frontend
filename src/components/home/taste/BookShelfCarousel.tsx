import { useEffect } from "react";

import Bookshelf from "@/assets/images/home/Bookshelf.png";
import CarouselArrowButton from "@/components/home/taste/CarouselArrowButton";
import { TASTE_EMPTY_TEXT } from "@/constants/home/home";
import { useHorizontalScroll } from "@/hooks/common/useHorizontalScroll";

import type { TasteBook } from "@/types/home/home";

type BookShelfCarouselProps = {
  books: TasteBook[];
  isPending: boolean;
  onSelect: (bookId: number) => void;
};

const SKELETON_ITEMS = [0, 1, 2, 3];

const VISIBLE_COUNT = 4;

const GAP_PX = 16;

// 한 화면에 네 권이 딱 맞도록 남는 폭을 나눠 가짐
const ITEM_WIDTH = `calc((100% - ${GAP_PX * (VISIBLE_COUNT - 1)}px) / ${VISIBLE_COUNT})`;

export default function BookShelfCarousel({ books, isPending, onSelect }: BookShelfCarouselProps) {
  const { containerRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext, refresh } =
    useHorizontalScroll(1);

  // 데이터 로드 후 버튼 상태 재계산
  useEffect(() => {
    refresh();
  }, [books, refresh]);

  if (!isPending && books.length === 0) {
    return <p className="py-10 text-center text-[14px] text-[#ABA394]">{TASTE_EMPTY_TEXT}</p>;
  }

  return (
    <div className="relative mx-4 pb-6" aria-roledescription="캐러셀">
      {/* 선반 좌우 여백 */}
      <div className="px-6">
        <div
          ref={containerRef}
          className="relative z-10 flex snap-x snap-mandatory items-end gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {isPending
            ? SKELETON_ITEMS.map((item) => (
                <span
                  key={item}
                  style={{ flex: `0 0 ${ITEM_WIDTH}` }}
                  className="h-26 animate-pulse rounded-sm bg-[#EAE7E1]"
                />
              ))
            : books.map((book) => (
                <button
                  key={book.bookId}
                  type="button"
                  onClick={() => onSelect(book.bookId)}
                  style={{ flex: `0 0 ${ITEM_WIDTH}` }}
                  className="snap-start"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-26 w-full object-cover shadow-[0_3px_6px_rgba(0,0,0,0.18)]"
                  />
                </button>
              ))}
        </div>
      </div>

      {/* 표지 아래에 깔리는 선반 */}
      <img
        src={Bookshelf}
        alt=""
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
      />

      <CarouselArrowButton side="prev" visible={canScrollPrev} onClick={scrollPrev} />
      <CarouselArrowButton side="next" visible={canScrollNext} onClick={scrollNext} />
    </div>
  );
}
