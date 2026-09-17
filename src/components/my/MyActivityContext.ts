import { createContext, useContext } from "react";
import type { LikedComment } from "@/types/my";
export const MyActivityContext = createContext<{
  comments: LikedComment[];
  unlikeComment: (id: string) => void;
} | null>(null);
export function useMyActivity() {
  const value = useContext(MyActivityContext);
  if (!value) throw new Error("MyActivityProvider is required");
  return value;
}
