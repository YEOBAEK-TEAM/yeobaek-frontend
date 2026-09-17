import { GROUP_SEARCH_PLACEHOLDER } from "@/constants/training/discussion/discussion";

type GroupSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function GroupSearchBar({ value, onChange, onSubmit }: GroupSearchBarProps) {
  return (
    <form
      role="search"
      className="min-w-0 flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        type="search"
        enterKeyHint="search"
        aria-label="그룹 검색"
        placeholder={GROUP_SEARCH_PLACEHOLDER}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-13.5 w-full rounded-full border-[1.5px] border-[#A89F94] bg-white px-7 text-[15px] text-[#4F4D4E] outline-none placeholder:text-[#A89F94] focus-visible:border-[#4F4D4E] [&::-webkit-search-cancel-button]:appearance-none"
      />
    </form>
  );
}
