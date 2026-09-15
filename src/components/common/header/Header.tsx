import LityIcon from "@/assets/icons/LityIcon.png";
import BellIcon from "@/assets/icons/BellIcon.png";
import SearchIcon from "@/assets/icons/SearchIcon.png";

type HeaderProps = {
  title: string;
  action?: "bell" | "search";
  onActionClick?: () => void;
  className?: string;
};

export default function Header({
  title,
  action,
  onActionClick,
  className = "h-17 pt-10 px-5",
}: HeaderProps) {
  return (
    <header className={`flex gap-2 ${className}`}>
      <img src={LityIcon} alt="리티짱" className="h-11 w-11" />
      <h1
        className="font-extrabold pt-2 text-3xl text-[#4F4D4E]"
        style={{ fontFamily: "BMDOHYEON, sans-serif" }}
      >
        {title}
      </h1>
      <div className="ml-auto mt-1">
        {action == "bell" && (
          <button type="button" aria-label="알림" onClick={onActionClick}>
            <img src={BellIcon} alt="" className="h-10 w-10 cursor-pointer" />
          </button>
        )}
        {action == "search" && (
          <button type="button" aria-label="검색" onClick={onActionClick}>
            <img src={SearchIcon} alt="" className="h-9 w-9 cursor-pointer" />
          </button>
        )}
      </div>
    </header>
  );
}
