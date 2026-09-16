import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { LikedPage } from "@/types/my";
import { dateLabel, readerLink } from "../myUtils";
export default function LikedPageItem({
  item,
  onUnlike,
  compact = false,
}: {
  item: LikedPage;
  onUnlike: () => void;
  compact?: boolean;
}) {
  return (
    <article className="relative rounded-xl border border-[#E2E2E2] bg-[#F9F9F6]">
      <Link to={readerLink(item.bookId, item.page)} className="flex gap-5 p-4 pr-6">
        {!compact && <img src={item.coverUrl} alt="" className="h-29 w-19 shrink-0 object-cover" />}
        <div className="min-w-0 flex-1 text-sm font-medium text-[#777]">
          {!compact && <h2 className="mb-1 pr-5 font-bold text-black">{item.bookTitle}</h2>}
          <p className={compact ? "pr-6 text-base font-bold text-black" : ""}>p.{item.page}</p>
          <p className="mt-1 line-clamp-2 leading-5">“{item.content}”</p>
          <time className="mt-2 block" dateTime={item.createdAt}>
            {dateLabel(item.createdAt)}
          </time>
        </div>
      </Link>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onUnlike();
        }}
        aria-label={`${item.bookTitle} ${item.page}페이지 좋아요 취소`}
        className="absolute top-3 right-3 flex size-7 items-center justify-center text-[#D92323]"
      >
        <Heart size={20} fill="currentColor" />
      </button>
    </article>
  );
}
