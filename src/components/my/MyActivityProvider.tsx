import { useState, type ReactNode } from "react";
import { mockLikedComments } from "@/mocks/my";
import { MyActivityContext } from "./MyActivityContext";
export default function MyActivityProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState(mockLikedComments);
  return (
    <MyActivityContext.Provider
      value={{
        comments,
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
