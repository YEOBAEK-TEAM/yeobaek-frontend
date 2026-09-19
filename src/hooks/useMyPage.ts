import { useQuery } from "@tanstack/react-query";
import { getMyPage } from "@/api/my";
import type { MyPageParams } from "@/types/my";
import { useAuthStore } from "@/stores/auth";

export const useMyPage = ({ year, month }: MyPageParams = {}) => {
  const userId = useAuthStore((state) => state.userId);
  return useQuery({
    queryKey: ["mypage", userId, year, month],
    queryFn: ({ signal }) => getMyPage({ year, month }, signal),
  });
};
