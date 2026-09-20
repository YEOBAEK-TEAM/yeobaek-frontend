import { useParams } from "react-router-dom";
import ActivityPagesView from "@/components/my/ActivityPagesView";
export default function LikedBookPagesPage() {
  const { bookId } = useParams();
  return <ActivityPagesView kind="liked-pages" bookId={Number(bookId)} />;
}
