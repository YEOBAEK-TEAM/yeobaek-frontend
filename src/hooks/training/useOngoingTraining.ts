import { useQuery } from "@tanstack/react-query";

import { getTrainingRooms } from "@/api/training/bookReportTraining";
import { getUnderstandRooms } from "@/api/training/comprehension/understandApi";
import { toBookReportTraining, toComprehensionTraining } from "@/utils/training/toOngoingTraining";

// 훈련 종류별로 가장 최근 방 하나씩, 배너와 중복 생성 차단에 함께 사용
export const useBookReportRoom = () =>
  useQuery({
    queryKey: ["trainings", "book-report", "latest"],
    queryFn: ({ signal }) => getTrainingRooms(signal),
    select: (data) => toBookReportTraining(data.items[0]),
  });

export const useComprehensionRoom = () =>
  useQuery({
    queryKey: ["trainings", "understand", "latest"],
    queryFn: ({ signal }) => getUnderstandRooms(null, signal),
    select: (data) => toComprehensionTraining(data.items[0]),
  });
