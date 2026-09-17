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
    </label>
  );
}
