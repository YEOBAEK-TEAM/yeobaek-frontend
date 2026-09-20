import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components/common/header/Header";
import LikedPageItem from "./liked/LikedPageItem";
import LikedBookItem from "./liked/LikedBookItem";
import LikedPagesTabs from "./liked/LikedPagesTabs";
import {
  useLikedPages,
  useLikedPagesByBook,
  useBookmarkedPages,
  useBookmarkedPagesByBook,
} from "@/hooks/useActivityPages";
import type { ActivityKind } from "@/types/activity";

export default function ActivityPagesView({
  kind,
  bookId,
}: {
  kind: ActivityKind;
  bookId?: number;
}) {
  const navigate = useNavigate();
  const [active, setActive] = useState<"all" | "books">("all");
  const [query, setQuery] = useState("");
  const isLike = kind === "liked-pages";
  const isBook = bookId !== undefined;
  const validBook = !isBook || (Number.isSafeInteger(bookId) && bookId > 0);
  const showPages = isBook || active === "all";
  const likes = useLikedPages(validBook && isLike && showPages, bookId);
  const bookmarks = useBookmarkedPages(validBook && !isLike && showPages, bookId);
  const likedBooks = useLikedPagesByBook(validBook && isLike && !showPages);
  const bookmarkedBooks = useBookmarkedPagesByBook(validBook && !isLike && !showPages);
  const pages = isLike ? likes : bookmarks;
  const books = isLike ? likedBooks : bookmarkedBooks;
  const result = showPages ? pages : books;
  const title = isLike ? "좋아요한 페이지" : "북마크한 페이지";
  const search = query.trim().toLocaleLowerCase();
  const matches = (pages.data ?? []).filter((item) =>
    `${item.bookTitle} ${item.firstSentence ?? ""}`.toLocaleLowerCase().includes(search),
  );
  const groups = isLike
    ? (likedBooks.data ?? []).map((book) => ({ book, count: book.likeCount }))
    : (bookmarkedBooks.data ?? []).map((book) => ({ book, count: book.bookmarkCount }));
  return (
    <main className="pb-8 text-[#30201D]">
      <Header
        title={isBook ? (pages.data?.[0]?.bookTitle ?? title) : title}
        onBack={() => navigate(isBook ? `/my/${kind}` : "/my")}
      />
      {!isBook && <LikedPagesTabs active={active} onChange={setActive} />}
      {isBook && pages.isSuccess && (
        <p className="-mt-4 text-center text-sm font-semibold text-[#777]">
          {pages.data.length}개의 {title}
        </p>
      )}
      <div className={isBook ? "space-y-3 px-5 pt-10" : "px-5 pt-8"}>
        {!isBook && showPages && (
          <label className="mb-5 flex items-center gap-2 rounded-xl border border-[#E2E2E2] bg-[#F9F9F6] px-6 py-4">
            <input
              type="search"
              aria-label="책 제목이나 문장으로 검색"
              placeholder="책 제목이나 문장으로 검색해보세요"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#AAA]"
            />
            <Search className="shrink-0 text-[#555]" size={27} />
          </label>
        )}
        {!validBook ? (
          <p role="alert" className="py-12 text-center text-sm text-[#888]">
            책을 찾을 수 없습니다.
          </p>
        ) : result.isPending ? (
          <p role="status" className="py-12 text-center text-sm text-[#888]">
            페이지 목록을 불러오는 중입니다.
          </p>
        ) : result.isError ? (
          <div role="alert" className="py-12 text-center text-sm text-[#888]">
            <p>페이지 목록을 불러오지 못했습니다.</p>
            <button
              type="button"
              disabled={result.isFetching}
              className="mt-3 underline"
              onClick={() => void result.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : showPages ? (
          <div className="space-y-2">
            {matches.map((item) => (
              <LikedPageItem key={item.pageId} item={item} kind={kind} compact={isBook} />
            ))}
            {!matches.length && (
              <p className="py-12 text-center text-sm text-[#888]">
                {search && (pages.data?.length ?? 0) > 0
                  ? "검색 결과가 없습니다."
                  : `${title}가 없습니다.`}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {groups.map(({ book, count }) => (
              <LikedBookItem key={book.bookId} book={book} count={count} kind={kind} />
            ))}
            {!groups.length && (
              <p className="py-12 text-center text-sm text-[#888]">{title}가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
