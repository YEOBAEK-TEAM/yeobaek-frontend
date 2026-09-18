import { useQuery } from "@tanstack/react-query";
import { getMyPage } from "@/api/my";
import type { MyPageParams } from "@/types/my";

export const useMyPage = ({ year, month }: MyPageParams = {}) =>
  useQuery({
    queryKey: ["mypage", year, month],
    queryFn: ({ signal }) => getMyPage({ year, month }, signal),
  });
