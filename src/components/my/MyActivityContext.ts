import { createContext, useContext } from "react";
import type { LikedComment, LikedPage } from "@/types/my";
export const MyActivityContext = createContext<{
  pages: LikedPage[];
  comments: LikedComment[];
  unlikePage: (id: string) => void;
  unlikeComment: (id: string) => void;
} | null>(null);
export function useMyActivity() {
  const value = useContext(MyActivityContext);
  if (!value) throw new Error("MyActivityProvider is required");
  return value;
}
