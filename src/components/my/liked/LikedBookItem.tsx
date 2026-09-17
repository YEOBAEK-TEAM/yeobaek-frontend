import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ActivityBook, ActivityKind } from "@/types/activity";
export default function LikedBookItem({
  book,
  count,
  kind = "liked-pages",
}: {
  book: ActivityBook;
  count: number;
  kind?: ActivityKind;
}) {
  return (
    <Link
      to={`/my/${kind}/${book.bookId}`}
      className="flex min-h-26 items-center gap-5 rounded-xl border border-[#E2E2E2] bg-[#F9F9F6] p-4"
    >
      <img src={book.coverImageUrl} alt="" className="h-18 w-12 shrink-0 object-cover" />
      <div className="flex-1">
        <h2 className="text-base font-bold text-black">{book.bookTitle}</h2>
        <p className="mt-1 text-sm text-[#777]">{count}개의 페이지</p>
      </div>
      <ChevronRight className="shrink-0" />
    </Link>
  );
}
