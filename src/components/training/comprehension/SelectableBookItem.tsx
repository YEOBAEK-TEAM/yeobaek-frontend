import type { ReactNode } from "react";

type SelectableBookItemProps = {
  name: string;
  value: string;
  checked: boolean;
  divided: boolean;
  coverUrl: string;
  title: ReactNode;
  author: string;
  onSelect: () => void;
  showRadio?: boolean;
};

export default function SelectableBookItem({
  name,
  value,
  checked,
  divided,
  coverUrl,
  title,
  author,
  onSelect,
  showRadio = false,
}: SelectableBookItemProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 px-4 py-3 ${
        checked
          ? "rounded-xl border border-[#645A50] bg-[#EEECE4]"
          : `border border-transparent ${divided ? "border-b-[#F0ECE3]" : ""}`
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />

      <img src={coverUrl} alt="" className="h-18 w-13 shrink-0 object-cover" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-bold text-[#2C2A2B]">{title}</p>
        <p className="truncate text-[14px] text-[#4F4D4E]">{author}</p>
      </div>

      {showRadio && (
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#4F4D4E] bg-white"
        >
          {checked && <span className="h-3 w-3 rounded-full bg-[#4F4D4E]" />}
        </span>
      )}
    </label>
  );
}
