import { isAxiosError } from "axios";

import { api } from "@/api/axios";
import { getBookReviews } from "@/api/library/report";
import { getReadingRecords } from "@/api/readingRecord";
import { REPORT_UNTITLED } from "@/constants/library/report";
import { ROOM_SORT } from "@/constants/training/discussion/room";

import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/auth";
import type {
  DiscussionRoomApplicantResponse,
  DiscussionRoomCreateRequest,
  DiscussionRoomCreateResponse,
  DiscussionRoomInviteCodeResponse,
  DiscussionRoomJoinResponse,
  DiscussionRoomResponse,
  DiscussionTopicResponse,
  PageResponse,
  RoomErrorCode,
  RoomListParams,
} from "@/types/training/discussion/room";

const TOPIC_PAGE_SIZE = 50;

export class RoomApiError extends Error {
  code: RoomErrorCode | null;

  constructor(message: string, code: RoomErrorCode | null = null) {
    super(message);
    this.name = "RoomApiError";
    this.code = code;
  }
}

// 서버 에러 코드 표를 받기 전까지 호출 지점이 지정한 코드로 대체
const toRoomApiError = (error: unknown, fallbackCode: RoomErrorCode | null) => {
  if (!isAxiosError(error)) return error;

  const data = error.response?.data as ApiResponse<unknown> | undefined;

  return new RoomApiError(data?.message ?? error.message, fallbackCode);
};

export const requestRoomApi = async <T>(
  call: () => Promise<AxiosResponse<ApiResponse<T>>>,
  fallbackCode: RoomErrorCode | null = null,
): Promise<T> => {
  try {
    const response = await call();
    if (!response.data.success) throw new RoomApiError(response.data.message, fallbackCode);

    return response.data.data;
  } catch (error) {
    throw toRoomApiError(error, fallbackCode);
  }
};

// 검색어가 있으면 검색 API, 없으면 정렬 목록 API
export const getRooms = ({
  filter,
  keyword,
  page,
  signal,
}: RoomListParams & { signal?: AbortSignal }): Promise<PageResponse<DiscussionRoomResponse>> =>
  keyword
    ? requestRoomApi(() =>
        api.get<ApiResponse<PageResponse<DiscussionRoomResponse>>>(
          "/api/v1/discussion-rooms/search",
          { params: { keyword, sort: ROOM_SORT[filter], page }, signal },
        ),
      )
    : requestRoomApi(() =>
        api.get<ApiResponse<PageResponse<DiscussionRoomResponse>>>("/api/v1/discussion-rooms", {
          params: { sort: ROOM_SORT[filter], page },
          signal,
        }),
      );

export const getRoomDetail = (roomId: number, signal?: AbortSignal) =>
  requestRoomApi(
    () =>
      api.get<ApiResponse<DiscussionRoomResponse>>(`/api/v1/discussion-rooms/${roomId}`, {
        signal,
      }),
    "ROOM_NOT_FOUND",
  );

// 참여 코드로 방 정보만 조회, 신청은 별도
export const getRoomByInviteCode = (code: string, signal?: AbortSignal) =>
  requestRoomApi(
    () =>
      api.get<ApiResponse<DiscussionRoomResponse>>("/api/v1/discussion-rooms/invite-code", {
        params: { code },
        signal,
      }),
    "INVALID_CODE",
  );

export const createRoom = (body: DiscussionRoomCreateRequest) =>
  requestRoomApi(() =>
    api.post<ApiResponse<DiscussionRoomCreateResponse>>("/api/v1/discussion-rooms", body),
  );

export const getRoomInviteCode = (roomId: number, signal?: AbortSignal) =>
  requestRoomApi(() =>
    api.get<ApiResponse<DiscussionRoomInviteCodeResponse>>(
      `/api/v1/discussion-rooms/${roomId}/invite-code`,
      { signal },
    ),
  );

// 비공개방은 참여 코드가 함께 있어야 신청 가능
export const requestJoinRoom = ({ roomId, inviteCode }: { roomId: number; inviteCode?: string }) =>
  requestRoomApi(() =>
    api.post<ApiResponse<DiscussionRoomJoinResponse>>(
      `/api/v1/discussion-rooms/${roomId}/apply`,
      inviteCode ? { inviteCode } : {},
    ),
  );

export const joinRoomByCode = (inviteCode: string) =>
  requestRoomApi(
    () =>
      api.post<ApiResponse<DiscussionRoomJoinResponse>>("/api/v1/discussion-rooms/apply", {
        inviteCode,
      }),
    "INVALID_CODE",
  );

export const getRoomApplicants = ({
  roomId,
  page,
  signal,
}: {
  roomId: number;
  page: number;
  signal?: AbortSignal;
}) =>
  requestRoomApi(() =>
    api.get<ApiResponse<PageResponse<DiscussionRoomApplicantResponse>>>(
      `/api/v1/discussion-rooms/${roomId}/applicants`,
      { params: { page }, signal },
    ),
  );

export const approveApplicant = ({ roomId, memberId }: { roomId: number; memberId: number }) =>
  requestRoomApi(() =>
    api.post<ApiResponse<void>>(
      `/api/v1/discussion-rooms/${roomId}/applicants/${memberId}/approve`,
    ),
  );

export const rejectApplicant = ({ roomId, memberId }: { roomId: number; memberId: number }) =>
  requestRoomApi(() =>
    api.post<ApiResponse<void>>(`/api/v1/discussion-rooms/${roomId}/applicants/${memberId}/reject`),
  );

export const kickRoomMember = ({ roomId, memberId }: { roomId: number; memberId: number }) =>
  requestRoomApi(() =>
    api.delete<ApiResponse<void>>(`/api/v1/discussion-rooms/${roomId}/members/${memberId}`),
  );

export const leaveRoom = (roomId: number) =>
  requestRoomApi(() =>
    api.delete<ApiResponse<void>>(`/api/v1/discussion-rooms/${roomId}/members/me`),
  );

export const deleteRoom = (roomId: number) =>
  requestRoomApi(() => api.delete<ApiResponse<void>>(`/api/v1/discussion-rooms/${roomId}`));

const includesKeyword = (values: string[], keyword: string) => {
  const normalized = keyword.toLowerCase();

  return values.some((value) => value.toLowerCase().includes(normalized));
};

// 주제 목록 전용 API가 없어 완독 도서와 작성한 독후감을 합쳐 사용
export const getDiscussionTopics = async (
  keyword: string,
  signal?: AbortSignal,
): Promise<DiscussionTopicResponse[]> => {
  const [records, reviews] = await Promise.all([
    getReadingRecords({ status: "COMPLETED", size: TOPIC_PAGE_SIZE }, signal),
    getBookReviews({ page: 0, status: "PUBLISHED", signal }),
  ]);

  const bookTopics: DiscussionTopicResponse[] = records.items.map((item) => ({
    type: "book",
    bookId: item.bookId,
    bookTitle: item.bookTitle,
    author: item.author ?? "",
    coverUrl: item.coverImageUrl ?? "",
  }));

  const reportTopics: DiscussionTopicResponse[] = reviews.items.map((item) => ({
    type: "report",
    reportId: item.reviewId,
    bookId: item.bookId,
    bookTitle: item.bookTitle,
    reportTitle: item.title ?? REPORT_UNTITLED,
    coverUrl: item.coverImageUrl ?? "",
  }));

  const topics = [...bookTopics, ...reportTopics];
  if (!keyword) return topics;

  return topics.filter((topic) =>
    includesKeyword(
      [topic.bookTitle, topic.type === "book" ? topic.author : topic.reportTitle],
      keyword,
    ),
  );
};
