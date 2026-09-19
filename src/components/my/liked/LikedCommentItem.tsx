import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getContentPage } from "@/api/contentPage";
import { useCommentMutation } from "@/hooks/useComments";
import type { ActivityLikedComment } from "@/types/my";
import ProfileImage from "../ProfileImage";
import { dateLabel } from "../myUtils";
export default function LikedCommentItem({ item }: { item: ActivityLikedComment }) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const unlike = useCommentMutation();
  const open = useMutation({
    mutationFn: () =>
      client.fetchQuery({
        queryKey: ["content-pages", item.pageId],
        queryFn: ({ signal }) => getContentPage(item.pageId, signal),
      }),
    onSuccess: (page) => navigate(`/library/read?bookId=${page.bookId}&pageId=${item.pageId}`),
  });
  return (
    <article className="relative flex gap-3 py-5">
      <ProfileImage
        src={item.profileImageUrl}
        alt=""
        className="size-12 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1 pr-1">
        <button
          type="button"
          disabled={open.isPending}
          onClick={() => open.mutate()}
          className="w-full text-left"
        >
          <div className="flex justify-between gap-2 pr-6">
            <span className="font-bold text-black">{item.nickname}</span>
            <time className="text-sm font-semibold text-[#777]" dateTime={item.createdAt}>
              {dateLabel(item.createdAt)}
            </time>
          </div>
          <p className="mt-1 text-sm font-medium leading-5 text-[#777]">“{item.content}”</p>
          <p className="mt-1 text-sm text-[#777]">
            {item.bookTitle} · {item.pageNumber}p
          </p>
        </button>
        {open.isError && (
          <p role="alert" className="mt-2 text-sm text-[#888]">
            페이지를 열지 못했습니다. 다시 시도해 주세요.
          </p>
        )}
        {unlike.isError && (
          <p role="alert" className="mt-2 text-sm text-[#888]">
            좋아요를 취소하지 못했습니다. 다시 시도해 주세요.
          </p>
        )}
      </div>
      <button
        type="button"
        aria-label={`${item.nickname} 댓글 좋아요 취소`}
        disabled={unlike.isPending}
        onClick={(event) => {
          event.stopPropagation();
          void unlike.run({ type: "unlike", pageId: item.pageId, commentId: item.commentId });
        }}
        className="absolute top-5 right-0 text-[#D92323]"
      >
        <Heart size={18} fill="currentColor" />
      </button>
    </article>
  );
}
