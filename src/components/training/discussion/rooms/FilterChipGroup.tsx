type FilterChipGroupProps<T extends string> = {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export default function FilterChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterChipGroupProps<T>) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-3 gap-5">
      {options.map((option) => {
        const isSelected = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.id)}
            className={`h-7.5 rounded-full border-[1.5px] border-[#4F4D4E] text-[15px] font-semibold transition-colors duration-200 ${
              isSelected ? "bg-[#4F4D4E] text-white" : "bg-transparent text-[#4F4D4E]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
