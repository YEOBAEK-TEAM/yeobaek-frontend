import SearchIcon from "@/assets/icons/SearchIcon.png";

type SearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
};

export default function SearchField({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  className = "",
}: SearchFieldProps) {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={`flex h-14 items-center gap-3.5 rounded-xl bg-white px-4 shadow-[0_2px_14px_rgba(79,77,78,0.07)] ${className}`}
    >
      <img src={SearchIcon} alt="" className="h-7 w-7 shrink-0" />

      <input
        type="search"
        enterKeyHint="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#4F4D4E] outline-none placeholder:text-[#A8ABB2] [&::-webkit-search-cancel-button]:appearance-none"
      />
    </form>
  );
}
