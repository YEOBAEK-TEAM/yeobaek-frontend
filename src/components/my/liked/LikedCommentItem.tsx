import { Heart, CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import type { LikedComment } from "@/types/my";
import { dateLabel, readerLink } from "../myUtils";
export default function LikedCommentItem({
  item,
  onUnlike,
}: {
  item: LikedComment;
  onUnlike: () => void;
}) {
  return (
    <article className="relative flex gap-3 py-5">
      <CircleUserRound
        aria-hidden="true"
        className="size-12 shrink-0 text-[#AAA]"
        strokeWidth={1.5}
      />
      <Link to={readerLink(item.bookId, item.page, item.commentId)} className="min-w-0 flex-1 pr-1">
        <div className="flex justify-between gap-2 pr-6">
          <h2 className="font-bold text-black">{item.userName}</h2>
          <time className="text-sm font-semibold text-[#777]" dateTime={item.createdAt}>
            {dateLabel(item.createdAt)}
          </time>
        </div>
        <p className="mt-1 text-sm font-medium leading-5 text-[#777]">“{item.content}”</p>
        <p className="mt-1 text-sm text-[#777]">
          {item.bookTitle} · {item.page}p
        </p>
      </Link>
      <button
        type="button"
        aria-label={`${item.userName} 댓글 좋아요 취소`}
        onClick={(event) => {
          event.stopPropagation();
          onUnlike();
        }}
        className="absolute top-5 right-0 text-[#D92323]"
      >
        <Heart size={18} fill="currentColor" />
      </button>
    </article>
  );
}
