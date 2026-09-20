import { OPENED_SUFFIX, ROOM_VISIBILITY_LABEL } from "@/constants/training/discussion/room";
import { formatReportDate } from "@/utils/training/formatReportDate";

import type {
  ApplicantView,
  DiscussionRoomApplicantResponse,
  DiscussionRoomCreateRequest,
  DiscussionRoomResponse,
  DiscussionTopicResponse,
  DiscussionTopicView,
  MyJoinStatus,
  RoomCreateForm,
  RoomDetailView,
  RoomJoinStatus,
  RoomSummaryView,
} from "@/types/training/discussion/room";

export const JOIN_STATUS: Record<MyJoinStatus, RoomJoinStatus> = {
  NONE: "none",
  PENDING: "pending",
  APPROVED: "joined",
};

export const toTopicViews = (responses: DiscussionTopicResponse[]): DiscussionTopicView[] =>
  responses.map((response) =>
    response.type === "book"
      ? {
          key: `book-${response.bookId}`,
          type: "book",
          bookId: response.bookId,
          reportId: null,
          title: response.bookTitle,
          subtitle: response.author,
          coverUrl: response.coverUrl,
        }
      : {
          key: `report-${response.reportId}`,
          type: "report",
          bookId: response.bookId,
          reportId: response.reportId,
          title: response.bookTitle,
          subtitle: response.reportTitle,
          coverUrl: response.coverUrl,
        },
  );

export const toRoomSummaryView = (response: DiscussionRoomResponse): RoomSummaryView => ({
  roomId: response.roomId,
  title: response.title,
  author: response.bookAuthor ?? "",
  coverUrl: response.bookCoverImageUrl ?? "",
  participantText: `${response.memberCount}명 참여중`,
  tags: response.tags ?? [],
  visibility: response.isPrivate ? "private" : "public",
  visibilityLabel: ROOM_VISIBILITY_LABEL[response.isPrivate ? "private" : "public"],
  joinStatus: JOIN_STATUS[response.myStatus],
});

export const toRoomDetailView = (response: DiscussionRoomResponse): RoomDetailView => ({
  ...toRoomSummaryView(response),
  description: response.description ?? "",
  host: { nickname: response.hostNickname, imageUrl: response.hostProfileImageUrl },
  openedLabel: `${formatReportDate(response.createdAt)}${OPENED_SUFFIX}`,
});

export const toApplicantViews = (responses: DiscussionRoomApplicantResponse[]): ApplicantView[] =>
  responses.map((response) => ({
    memberId: response.memberId,
    nickname: response.nickname,
    imageUrl: response.profileImageUrl,
    appliedLabel: formatReportDate(response.appliedAt),
  }));

// 독후감 주제도 서버는 책 기준으로 받아 bookId만 전달
export const toCreateRoomRequest = (
  form: RoomCreateForm & { topic: DiscussionTopicView },
): DiscussionRoomCreateRequest => ({
  bookId: form.topic.bookId,
  title: form.title.trim(),
  tags: form.tags,
  description: form.description.trim(),
  isPrivate: form.visibility === "private",
});
