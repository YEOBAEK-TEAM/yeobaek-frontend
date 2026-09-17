import { useParams } from "react-router-dom";
import ActivityPagesView from "@/components/my/ActivityPagesView";
export default function BookmarkedBookPagesPage() {
  const { bookId } = useParams();
  return <ActivityPagesView kind="bookmarked-pages" bookId={Number(bookId)} />;
}
