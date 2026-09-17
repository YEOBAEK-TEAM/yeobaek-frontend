import { RoomApiError } from "@/api/training/discussion/room";
import { ROOM_ERROR_FALLBACK, ROOM_ERROR_MESSAGE } from "@/constants/training/discussion/room";

// 서버 에러 코드별 안내 문구
export const getRoomErrorMessage = (error: unknown) =>
  error instanceof RoomApiError ? ROOM_ERROR_MESSAGE[error.code] : ROOM_ERROR_FALLBACK;
