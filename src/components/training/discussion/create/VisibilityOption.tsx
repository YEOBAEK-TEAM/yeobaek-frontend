import RadioMark from "@/components/training/discussion/shared/RadioMark";

type VisibilityOptionProps = {
  name: string;
  value: string;
  checked: boolean;
  title: string;
  description: string;
  onSelect: () => void;
};

export default function VisibilityOption({
  name,
  value,
  checked,
  title,
  description,
  onSelect,
}: VisibilityOptionProps) {
  return (
    <label
      className={`flex h-18 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] px-2.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#4F4D4E] ${
        checked ? "border-[#4F4D4E] bg-[#EEEBE6]" : "border-[#5B5552] bg-[#F9FAFB]"
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

      <RadioMark checked={checked} />

      <span className="min-w-0 text-[15px] leading-5.5 text-[#2C2A2B]">
        <span className="block">{title}</span>
        <span className="block whitespace-nowrap">{description}</span>
      </span>
    </label>
  );
}
