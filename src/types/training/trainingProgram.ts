export type TrainingTab = "lity" | "debate";

export type TrainingProgramId = "book-report" | "comprehension";

// 카드/태그 배경은 Tailwind 스캐너가 읽을 수 있도록 클래스 문자열로 보관
export type TrainingProgram = {
  id: TrainingProgramId;
  title: string;
  description: string;
  tags: string[];
  character: string;
  cardClassName: string;
  tagClassName: string;
};
