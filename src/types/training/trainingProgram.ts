export type TrainingTab = "lity" | "debate";

export type TrainingProgramId = "book-report" | "comprehension";

// 카드와 태그 배경 클래스
export type TrainingProgram = {
  id: TrainingProgramId;
  title: string;
  description: string;
  tags: string[];
  character: string;
  cardClassName: string;
  tagClassName: string;
};
