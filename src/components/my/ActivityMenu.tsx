import { Link } from "react-router-dom";
export default function ActivityMenu() {
  return (
    <section className="px-8 pt-3">
      <h2 className="text-base font-bold">나의 활동기록</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          to="/my/liked-comments"
          className="rounded-full bg-[#F7F5F0] px-6 py-2 text-xs font-semibold"
        >
          좋아요 댓글
        </Link>
        <Link
          to="/my/liked-pages"
          className="rounded-full bg-[#F7F5F0] px-6 py-2 text-xs font-semibold"
        >
          좋아요 페이지
        </Link>
        <Link
          to="/my/bookmarked-pages"
          className="rounded-full bg-[#F7F5F0] px-6 py-2 text-xs font-semibold"
        >
          북마크 페이지
        </Link>
      </div>
    </section>
  );
}
