import { Bookmark, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { ActivityKind, ActivityPage } from "@/types/activity";
import { useTogglePageLike } from "@/hooks/useTogglePageLike";
import { useTogglePageBookmark } from "@/hooks/useTogglePageBookmark";
import { dateLabel } from "../myUtils";

export default function LikedPageItem({
  item,
  kind = "liked-pages",
  compact = false,
}: {
  item: ActivityPage;
  kind?: ActivityKind;
  compact?: boolean;
}) {
  const like = useTogglePageLike();
  const bookmark = useTogglePageBookmark();
  const isLike = kind === "liked-pages";
  const mutation = isLike ? like : bookmark;
  const label = isLike ? "좋아요" : "북마크";
  const Icon = isLike ? Heart : Bookmark;
  return (
    <article className="relative rounded-xl border border-[#E2E2E2] bg-[#F9F9F6]">
      <Link
        to={`/library/read?bookId=${item.bookId}&pageId=${item.pageId}`}
        className="flex gap-5 p-4 pr-6"
      >
        {!compact && (
          <img src={item.coverImageUrl} alt="" className="h-29 w-19 shrink-0 object-cover" />
        )}
        <div className="min-w-0 flex-1 text-sm font-medium text-[#777]">
          {!compact && <h2 className="mb-1 pr-5 font-bold text-black">{item.bookTitle}</h2>}
          <p className={compact ? "pr-6 text-base font-bold text-black" : ""}>
            p.{item.pageNumber}
          </p>
          {item.firstSentence && (
            <p className="mt-1 line-clamp-2 leading-5">“{item.firstSentence}”</p>
          )}
          <time className="mt-2 block" dateTime={item.savedAt}>
            {dateLabel(item.savedAt)}
          </time>
        </div>
      </Link>
      <button
        type="button"
        disabled={mutation.isPending}
        onClick={() => {
          if (mutation.isPending) return;
          if (isLike) like.mutate({ pageId: item.pageId, liked: true });
          else bookmark.mutate({ pageId: item.pageId, bookmarked: true });
        }}
        aria-label={`${item.bookTitle} ${item.pageNumber}페이지 ${label} 취소`}
        className={`absolute top-3 right-3 flex size-7 items-center justify-center disabled:opacity-50 ${isLike ? "text-[#D92323]" : "text-[#777]"}`}
      >
        <Icon size={20} fill="currentColor" />
      </button>
      {mutation.isError && (
        <p role="alert" className="px-4 pb-3 text-sm text-[#888]">
          {label}를 취소하지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
    </article>
  );
}
