// 대화 차례별 리티 응답
export const mockComprehensionReplies = [
  "좋은 질문입니다. 먼저 그 장면 바로 앞에서\n인물이 어떤 행동을 했는지 기억나시나요?",
  "맞습니다. 그럼 책에서 그 상황에 적용되는\n규칙이나 조건이 따로 있었나요?",
  "좋아요. 그 규칙과 인물의 행동을 이어보면\n어떤 설명이 가능할까요?",
  "정확합니다. 인물이 그렇게 행동할 수밖에 없던\n이유가 보이시나요?",
  "훌륭해요! 이제 궁금증이 해결 되었나요?\n예를 클릭하시면 훈련이 종료됩니다.",
];

export const mockComprehensionFallback =
  "조금 더 이야기해볼까요? 방금 말씀에서 가장\n헷갈렸던 부분은 어디였나요?";

// 종료 확인이 붙는 대화 차례
export const CONFIRM_END_TURN = mockComprehensionReplies.length - 1;
