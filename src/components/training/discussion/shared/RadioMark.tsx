type RadioMarkProps = {
  checked: boolean;
};

export default function RadioMark({ checked }: RadioMarkProps) {
  return (
    <span
      aria-hidden="true"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#4F4D4E] bg-white"
    >
      {checked && <span className="h-3 w-3 rounded-full bg-[#4F4D4E]" />}
    </span>
  );
}
