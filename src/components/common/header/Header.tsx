import LityIcon from "@/assets/icons/LityIcon.png";
import BellIcon from "@/assets/icons/BellIcon.png";
import SearchIcon from "@/assets/icons/SearchIcon.png";

type HeaderProps = {
  title: string;
  action?: "bell" | "search";
};

export default function Header({ title, action }: HeaderProps) {
  return (
    <div className="h-17 mt-10 flex gap-1 ">
      <img src={LityIcon} alt="리티짱" className="h-11 w-11" />
      <p className="font-extrabold pt-2 text-3xl text-[#4F4D4E]">{title}</p>
      <div className="absolute right-5 mt-1">
        {action == "bell" && (
          <button type="button">
            <img src={BellIcon} className="h-10 w-10 cursor-pointer"></img>
          </button>
        )}
        {action == "search" && (
          <button type="button">
            <img src={SearchIcon} className="h-10 w-10 cursor-pointer"></img>
          </button>
        )}
      </div>
    </div>
  );
}
