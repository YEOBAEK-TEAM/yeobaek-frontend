import { OPENED_SUFFIX, ROOM_VISIBILITY_LABEL } from "@/constants/training/discussion/room";
import { formatReportDate } from "@/utils/training/formatReportDate";

import type {
  CreateRoomRequest,
  DiscussionTopicResponse,
  DiscussionTopicView,
  RoomCreateForm,
  RoomDetailResponse,
  RoomDetailView,
  RoomSummaryResponse,
  RoomSummaryView,
} from "@/types/training/discussion/room";

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

export const toRoomSummaryView = (response: RoomSummaryResponse): RoomSummaryView => ({
  roomId: response.roomId,
  title: response.roomTitle,
  author: response.author,
  coverUrl: response.coverUrl,
  participantText: `${response.participantCount}명 참여중`,
  tags: response.tags,
  visibilityLabel: ROOM_VISIBILITY_LABEL[response.visibility],
  joinStatus: response.joinStatus,
});

export const toRoomDetailView = (response: RoomDetailResponse): RoomDetailView => ({
  ...toRoomSummaryView(response),
  description: response.description,
  host: { nickname: response.hostNickname, imageUrl: response.hostProfileImageUrl },
  openedLabel: `${formatReportDate(response.createdAt)}${OPENED_SUFFIX}`,
});

export const toCreateRoomRequest = (
  form: RoomCreateForm & { topic: DiscussionTopicView },
): CreateRoomRequest => ({
  topicType: form.topic.type,
  bookId: form.topic.bookId,
  reportId: form.topic.reportId,
  title: form.title.trim(),
  tags: form.tags,
  description: form.description.trim(),
  visibility: form.visibility,
});
