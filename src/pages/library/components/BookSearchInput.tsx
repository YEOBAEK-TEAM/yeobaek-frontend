import searchIcon from "@/assets/icons/SearchIcon.png";
import { ArrowIcon } from "./LibraryIcons";

type BookSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function BookSearchInput({ value, onChange, onSearch }: BookSearchInputProps) {
  return (
    <form
      role="search"
      className="mt-7 flex h-15 items-center gap-4 rounded-xl bg-[#F7F6F1] pr-2 pl-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <img src={searchIcon} alt="" className="h-7 w-7 shrink-0" />
      <input
        aria-label="도서 제목 또는 저자 검색"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-xl text-[#202020] outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        aria-label="검색"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${value.trim() ? "bg-[#4F4D4E] text-white" : "bg-[#99958C] text-[#202020]"}`}
      >
        <ArrowIcon />
      </button>
    </form>
  );
}
