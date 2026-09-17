import { useRef, type KeyboardEvent } from "react";

import ChoiceOption from "@/components/library/unlock-quiz/ChoiceOption";
import { CHOICE_LABELS } from "@/constants/library/unlockQuiz";

import type { UnlockQuizChoice } from "@/types/library/unlockQuiz";

type ChoiceGroupProps = {
  labelledBy: string;
  choices: UnlockQuizChoice[];
  value: string | undefined;
  onChange: (choiceId: string) => void;
};

const KEY_STEP: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

export default function ChoiceGroup({ labelledBy, choices, value, onChange }: ChoiceGroupProps) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = choices.findIndex((choice) => choice.choiceId === value);
  const focusableIndex = Math.max(selectedIndex, 0);

  // 방향키로 보기를 옮기며 바로 선택
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = KEY_STEP[event.key];
    if (!step) return;

    event.preventDefault();

    const focusedIndex = optionRefs.current.findIndex(
      (option) => option === document.activeElement,
    );
    const nextIndex =
      ((focusedIndex >= 0 ? focusedIndex : focusableIndex) + step + choices.length) %
      choices.length;

    onChange(choices[nextIndex].choiceId);
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-3"
    >
      {choices.map((choice, index) => (
        <ChoiceOption
          key={choice.choiceId}
          ref={(element) => {
            optionRefs.current[index] = element;
          }}
          label={CHOICE_LABELS[index] ?? String(index + 1)}
          text={choice.text}
          checked={choice.choiceId === value}
          tabIndex={index === focusableIndex ? 0 : -1}
          onSelect={() => onChange(choice.choiceId)}
        />
      ))}
    </div>
  );
}
