import { useId } from "react";

import ChoiceGroup from "@/components/library/unlock-quiz/ChoiceGroup";

import type { UnlockQuizQuestion } from "@/types/library/unlockQuiz";

type QuizQuestionProps = {
  number: number;
  question: UnlockQuizQuestion;
  value: string | undefined;
  onChange: (choiceId: string) => void;
};

export default function QuizQuestion({ number, question, value, onChange }: QuizQuestionProps) {
  const questionId = useId();

  return (
    <section>
      <p aria-hidden="true" className="text-[26px] leading-8 font-bold text-[#1E1E1E]">
        Q{number}
      </p>

      <h2
        id={questionId}
        className="mt-4 pl-6 text-[22px] leading-[30px] font-bold break-keep text-[#1E1E1E]"
      >
        <span className="sr-only">{number}번 문제. </span>
        {question.text}
      </h2>

      <div className="mt-9">
        <ChoiceGroup
          labelledBy={questionId}
          choices={question.choices}
          value={value}
          onChange={onChange}
        />
      </div>
    </section>
  );
}
