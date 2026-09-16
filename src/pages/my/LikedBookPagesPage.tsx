import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/common/header/Header";
import LikedPageItem from "@/components/my/liked/LikedPageItem";
import { useMyActivity } from "@/components/my/MyActivityContext";
import { myBooks } from "@/mocks/my";
export default function LikedBookPagesPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { pages, unlikePage } = useMyActivity();
  const book = myBooks.find((item) => item.bookId === Number(bookId));
  const items = pages.filter((item) => item.bookId === Number(bookId) && item.liked);
  return (
    <main className="pb-8">
      <Header
        title={book?.bookTitle ?? "좋아요한 페이지"}
        onBack={() => navigate("/my/liked-pages")}
      />
      <p className="-mt-4 text-center text-sm font-semibold text-[#777]">
        {items.length}개의 좋아요한 페이지
      </p>
      <div className="space-y-3 px-5 pt-10">
        {items.map((item) => (
          <LikedPageItem key={item.id} item={item} compact onUnlike={() => unlikePage(item.id)} />
        ))}
        {!items.length && (
          <p className="py-12 text-center text-sm text-[#888]">
            {book ? "좋아요한 페이지가 없습니다." : "책을 찾을 수 없습니다."}
          </p>
        )}
      </div>
    </main>
  );
}
