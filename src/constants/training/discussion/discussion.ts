import type { DiscussionSubTab, GroupCardVariant } from "@/types/training/discussion/discussion";

export const DISCUSSION_SUB_TABS: { id: DiscussionSubTab; label: string }[] = [
  { id: "recommend", label: "추천" },
  { id: "joined", label: "내 그룹" },
  { id: "pending", label: "신청한 그룹" },
];

// 라우트 준비 전 이동 경로
export const DISCUSSION_PATH = {
  room: (roomId: number) => `/training/discussion/rooms/${roomId}`,
  groupDetail: (groupId: number) => `/training/discussion/groups/${groupId}`,
  createGroup: "/training/discussion/groups/new",
};

export const ACTIVE_DISCUSSION_EMPTY_TEXT = "아직 속해있는 토론장이 없습니다";

export const CONTINUE_DISCUSSION_LABEL = "토론 계속하기";

export const LAST_VISITED_LABEL = "마지막 참여";

export const GROUP_SEARCH_PLACEHOLDER = "그룹을 검색해 보세요";

export const CREATE_GROUP_LABEL = "그룹 만들기";

export const HOT_GROUP_SECTION = {
  title: "HOT 10",
  description: "현재 가장 뜨거운 토론장입니다. 참여해서 의견을 나눠보세요.",
  emptyText: "지금 열려 있는 토론장이 없어요",
};

export const NEW_GROUP_SECTION = {
  title: "신규 그룹",
  description: "오늘 만들어진 따끈따끈한 그룹들만 모았어요",
  emptyText: "오늘 만들어진 그룹이 아직 없어요",
};

export const HOT_BADGE_LABEL = "HOT";

export const MY_GROUP_EMPTY_TEXT = "아직 속해있는 그룹이 없습니다";

export const PENDING_GROUP_EMPTY_TEXT = "아직 신청한 그룹이 없습니다";

export const PENDING_STATUS_LABEL = "방장 승인 기다리는중...";

export const GROUP_ACTION_LABEL: Record<Exclude<GroupCardVariant, "pending">, string> = {
  recommend: "자세히 보기",
  joined: "토론 입장하기",
};

export const getSearchEmptyText = (keyword: string) => `'${keyword}'에 맞는 그룹이 없습니다`;

export const DEFAULT_PROFILE_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#dedad0"/><circle cx="14" cy="10" r="5" fill="#8c8580"/><path d="M4 25c0-6 4-9 10-9s10 3 10 9" fill="#8c8580"/></svg>')}`;
