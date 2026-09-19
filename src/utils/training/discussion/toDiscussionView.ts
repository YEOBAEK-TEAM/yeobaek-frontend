import { formatLastVisited } from "@/utils/training/discussion/formatLastVisited";
import {
  formatHostLabel,
  formatParticipantCount,
} from "@/utils/training/discussion/formatParticipants";
import { JOIN_STATUS } from "@/utils/training/discussion/toRoomView";

import type {
  ActiveDiscussionView,
  DiscussionGroupView,
  DiscussionRoomMainResponse,
  GroupCardVariant,
  GroupMembership,
} from "@/types/training/discussion/discussion";
import type { DiscussionRoomResponse } from "@/types/training/discussion/room";

const MEMBERSHIP_VARIANT: Record<GroupMembership, GroupCardVariant> = {
  none: "recommend",
  joined: "joined",
  pending: "pending",
};

const toBookView = (response: DiscussionRoomMainResponse) => ({
  roomId: response.roomId,
  title: response.bookTitle,
  author: response.bookAuthor ?? "",
  coverUrl: response.bookCoverImageUrl ?? "",
  host: {
    hostLabel: formatHostLabel(response.hostNickname),
    imageUrl: response.hostProfileImageUrl,
    participantText: formatParticipantCount(response.memberCount),
  },
});

// 참여 중인 토론방 중 가장 최근 활동 1개만 노출
export const toActiveDiscussionView = (
  responses: DiscussionRoomMainResponse[],
): ActiveDiscussionView | null => {
  const latest = responses.reduce<DiscussionRoomMainResponse | null>((prev, current) => {
    if (!current.lastVisitedAt) return prev;
    if (!prev?.lastVisitedAt) return current;

    return Date.parse(current.lastVisitedAt) > Date.parse(prev.lastVisitedAt) ? current : prev;
  }, null);

  const target = latest ?? responses[0];

  if (!target) return null;

  return {
    ...toBookView(target),
    lastVisitedAt: target.lastVisitedAt,
    lastVisitedLabel: target.lastVisitedAt ? formatLastVisited(target.lastVisitedAt) : "",
  };
};

export const toDiscussionGroupViews = (
  responses: DiscussionRoomMainResponse[],
): DiscussionGroupView[] =>
  responses.map((response) => ({
    ...toBookView(response),
    groupId: response.roomId,
    variant: MEMBERSHIP_VARIANT[JOIN_STATUS[response.myStatus]],
  }));

// 검색은 토론방 응답을 그대로 써서 그룹 카드로 변환
export const toSearchGroupViews = (responses: DiscussionRoomResponse[]): DiscussionGroupView[] =>
  responses.map((response) => ({
    roomId: response.roomId,
    title: response.bookTitle,
    author: response.bookAuthor ?? "",
    coverUrl: response.bookCoverImageUrl ?? "",
    host: {
      hostLabel: formatHostLabel(response.hostNickname),
      imageUrl: response.hostProfileImageUrl,
      participantText: formatParticipantCount(response.memberCount),
    },
    groupId: response.roomId,
    variant: MEMBERSHIP_VARIANT[JOIN_STATUS[response.myStatus]],
  }));
