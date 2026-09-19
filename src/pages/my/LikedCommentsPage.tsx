import { useNavigate } from "react-router-dom";
import Header from "@/components/common/header/Header";
import LikedCommentItem from "@/components/my/liked/LikedCommentItem";
import { useLikedComments } from "@/hooks/useLikedComments";
export default function LikedCommentsPage() {
  const navigate = useNavigate();
  const query = useLikedComments();
  const items = [
    ...new Map(
      query.data?.pages.flatMap((page) => page.items).map((item) => [item.commentId, item]),
    ).values(),
  ];
  return (
    <main className="pb-8">
      <Header title="좋아요한 댓글" onBack={() => navigate("/my")} />
      <div className="px-7 pt-2">
        {items.map((item) => (
          <LikedCommentItem key={item.commentId} item={item} />
        ))}
        {query.isPending && (
          <p role="status" className="py-16 text-center text-sm text-[#888]">
            좋아요한 댓글을 불러오는 중입니다.
          </p>
        )}
        {query.isError && (
          <div role="alert" className="py-6 text-center text-sm text-[#888]">
            <p>댓글 목록을 불러오지 못했습니다.</p>
            <button
              type="button"
              disabled={query.isFetching}
              className="mt-2 underline"
              onClick={() =>
                void (query.isFetchNextPageError ? query.fetchNextPage() : query.refetch())
              }
            >
              다시 시도
            </button>
          </div>
        )}
        {query.isSuccess && !items.length && (
          <p className="py-16 text-center text-sm text-[#888]">좋아요한 댓글이 없습니다.</p>
        )}
        {query.hasNextPage && (
          <button
            type="button"
            disabled={query.isFetching}
            className="min-h-11 w-full text-sm text-[#777]"
            onClick={() => {
              if (!query.isFetching) void query.fetchNextPage();
            }}
          >
            {query.isFetchingNextPage ? "불러오는 중…" : "더 보기"}
          </button>
        )}
      </div>
    </main>
  );
}
