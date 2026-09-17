import { formatLastVisited } from "@/utils/training/discussion/formatLastVisited";
import {
  formatHostLabel,
  formatParticipantCount,
} from "@/utils/training/discussion/formatParticipants";

import type {
  ActiveDiscussionResponse,
  ActiveDiscussionView,
  DiscussionBaseResponse,
  DiscussionGroupResponse,
  DiscussionGroupView,
  GroupCardVariant,
  GroupMembership,
} from "@/types/training/discussion/discussion";

const MEMBERSHIP_VARIANT: Record<GroupMembership, GroupCardVariant> = {
  none: "recommend",
  joined: "joined",
  pending: "pending",
};

const toBookView = (response: DiscussionBaseResponse) => ({
  roomId: response.roomId,
  title: response.bookTitle,
  author: response.author,
  coverUrl: response.coverUrl,
  host: {
    hostLabel: formatHostLabel(response.hostNickname),
    imageUrl: response.hostProfileImageUrl,
    participantText: formatParticipantCount(response.participantCount),
  },
});

// 참여 중인 토론방 중 가장 최근 활동 1개만 노출
export const toActiveDiscussionView = (
  responses: ActiveDiscussionResponse[],
): ActiveDiscussionView | null => {
  const latest = responses.reduce<ActiveDiscussionResponse | null>(
    (prev, current) =>
      !prev || Date.parse(current.lastVisitedAt) > Date.parse(prev.lastVisitedAt) ? current : prev,
    null,
  );

  if (!latest) return null;

  return {
    ...toBookView(latest),
    lastVisitedAt: latest.lastVisitedAt,
    lastVisitedLabel: formatLastVisited(latest.lastVisitedAt),
  };
};

export const toDiscussionGroupViews = (
  responses: DiscussionGroupResponse[],
): DiscussionGroupView[] =>
  responses.map((response) => ({
    ...toBookView(response),
    groupId: response.groupId,
    variant: MEMBERSHIP_VARIANT[response.membership],
    isHost: response.isHost,
  }));
