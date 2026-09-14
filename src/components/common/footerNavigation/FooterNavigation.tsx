import { NavLink } from "react-router-dom";

import collectionActiveIcon from "@/assets/icons/footer/collectionActiveIcon.png";
import collectionIcon from "@/assets/icons/footer/collectionIcon.png";
import homeActiveIcon from "@/assets/icons/footer/homeActiveIcon.png";
import homeIcon from "@/assets/icons/footer/homeIcon.png";
import libraryActiveIcon from "@/assets/icons/footer/libraryActiveIcon.png";
import libraryIcon from "@/assets/icons/footer/libraryIcon.png";
import myActiveIcon from "@/assets/icons/footer/myActiveIcon.png";
import myIcon from "@/assets/icons/footer/myIcon.png";
import trainingActiveIcon from "@/assets/icons/footer/trainingActiveIcon.png";
import trainingIcon from "@/assets/icons/footer/trainingIcon.png";

const navigationItems = [
  {
    path: "/vocabulary",
    label: "수집",
    icon: collectionIcon,
    activeIcon: collectionActiveIcon,
  },
  {
    path: "/training",
    label: "훈련",
    icon: trainingIcon,
    activeIcon: trainingActiveIcon,
  },
  {
    path: "/",
    label: "HOME",
    icon: homeIcon,
    activeIcon: homeActiveIcon,
  },
  {
    path: "/library",
    label: "서재",
    icon: libraryIcon,
    activeIcon: libraryActiveIcon,
  },
  {
    path: "/my",
    label: "MY",
    icon: myIcon,
    activeIcon: myActiveIcon,
  },
];

export default function FooterNavigation() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex h-22 w-full max-w-97.5 -translate-x-1/2 bg-[#B8C09C]">
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className="flex flex-1 flex-col items-center justify-center gap-1"
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? item.activeIcon : item.icon}
                alt={item.label}
                className="h-9 w-9 object-contain"
              />

              <span
                className={`text-[14px] ${
                  isActive ? "font-semibold text-white" : "font-medium text-[#68705A]"
                }`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
