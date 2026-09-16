import { useState, type ReactNode } from "react";
import { mockLikedComments, mockLikedPages } from "@/mocks/my";
import { MyActivityContext } from "./MyActivityContext";
export default function MyActivityProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState(mockLikedPages);
  const [comments, setComments] = useState(mockLikedComments);
  return (
    <MyActivityContext.Provider
      value={{
        pages,
        comments,
        unlikePage: (id) =>
          setPages((items) =>
            items.map((item) => (item.id === id ? { ...item, liked: false } : item)),
          ),
        unlikeComment: (id) =>
          setComments((items) =>
            items.map((item) => (item.id === id ? { ...item, liked: false } : item)),
          ),
      }}
    >
      {children}
    </MyActivityContext.Provider>
  );
}
