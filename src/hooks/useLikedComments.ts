import { activityKeys } from "@/hooks/queryKeys/activityKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLikedComments } from "@/api/activity";
import { useAuthStore } from "@/stores/auth";

export function useLikedComments() {
  const userId = useAuthStore((state) => state.userId);
  return useInfiniteQuery({
    queryKey: activityKeys.likedComments.list(userId),
    queryFn: ({ pageParam, signal }) => getLikedComments(pageParam, signal),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last, _pages, cursor, cursors) =>
      last.hasNext &&
      last.nextCursor != null &&
      last.nextCursor !== cursor &&
      !cursors.includes(last.nextCursor)
        ? last.nextCursor
        : undefined,
    enabled: userId !== null,
  });
}
