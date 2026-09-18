import type { Ref } from "react";

type ChoiceOptionProps = {
  ref: Ref<HTMLButtonElement>;
  label: string;
  text: string;
  checked: boolean;
  tabIndex: number;
  onSelect: () => void;
};

export default function ChoiceOption({
  ref,
  label,
  text,
  checked,
  tabIndex,
  onSelect,
}: ChoiceOptionProps) {
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      tabIndex={tabIndex}
      onClick={onSelect}
      className={`flex min-h-13 w-full items-center rounded-xl border py-3 pr-4 text-left transition-colors duration-200 ${
        checked ? "border-[#6E735E] bg-[#CFD1C2]" : "border-[#D6D3C8] bg-[#F9FAFB]"
      }`}
    >
      <span aria-hidden="true" className="w-19 shrink-0 pl-8 text-[15px] font-bold text-[#1E1E1E]">
        {label}.
      </span>
      <span className="text-[15px] leading-[25px] font-medium break-keep text-[#54555A]">
        {text}
      </span>
    </button>
  );
}
