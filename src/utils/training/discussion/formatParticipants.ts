export const formatHostLabel = (nickname: string) => `${nickname}(방장)`;

// 방장을 제외한 참여 인원 문구
export const formatParticipantCount = (participantCount: number) => {
  const others = Math.max(participantCount - 1, 0);

  return others > 0 ? `외 ${others}명 참여중` : "참여자 모집중";
};
