import { useNavigate } from "react-router-dom";
import Header from "@/components/common/header/Header";
import LikedCommentItem from "@/components/my/liked/LikedCommentItem";
import { useMyActivity } from "@/components/my/MyActivityContext";
export default function LikedCommentsPage() {
  const navigate = useNavigate();
  const { comments, unlikeComment } = useMyActivity();
  const items = comments.filter((item) => item.liked);
  return (
    <main className="pb-8">
      <Header title="좋아요한 댓글" onBack={() => navigate("/my")} />
      <div className="px-7 pt-2">
        {items.map((item) => (
          <LikedCommentItem key={item.id} item={item} onUnlike={() => unlikeComment(item.id)} />
        ))}
        {!items.length && (
          <p className="py-16 text-center text-sm text-[#888]">좋아요한 댓글이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
