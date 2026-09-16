import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components/common/header/Header";
import LikedPageItem from "@/components/my/liked/LikedPageItem";
import LikedBookItem from "@/components/my/liked/LikedBookItem";
import LikedPagesTabs from "@/components/my/liked/LikedPagesTabs";
import { useMyActivity } from "@/components/my/MyActivityContext";
export default function LikedPagesPage() {
  const navigate = useNavigate();
  const { pages, unlikePage } = useMyActivity();
  const [active, setActive] = useState<"all" | "books">("all");
  const [query, setQuery] = useState("");
  const liked = pages.filter((item) => item.liked);
  const matches = liked.filter((item) =>
    `${item.bookTitle} ${item.content}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const groups = [...new Set(liked.map((item) => item.bookId))].map((bookId) => {
    const items = liked.filter((item) => item.bookId === bookId);
    return { book: items[0], count: items.length };
  });
  return (
    <main className="pb-8 text-[#30201D]">
      <Header title="좋아요한 페이지" onBack={() => navigate("/my")} />
      <LikedPagesTabs active={active} onChange={setActive} />
      <div className="px-5 pt-8">
        {active === "all" ? (
          <>
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
            <div className="space-y-2">
              {matches.map((item) => (
                <LikedPageItem key={item.id} item={item} onUnlike={() => unlikePage(item.id)} />
              ))}
            </div>
            {!matches.length && (
              <p className="py-12 text-center text-sm text-[#888]">
                {query ? "검색 결과가 없습니다." : "좋아요한 페이지가 없습니다."}
              </p>
            )}
          </>
        ) : (
          <div className="space-y-2">
            {groups.map(({ book, count }) => (
              <LikedBookItem key={book.bookId} book={book} count={count} />
            ))}
            {!groups.length && (
              <p className="py-12 text-center text-sm text-[#888]">좋아요한 페이지가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
