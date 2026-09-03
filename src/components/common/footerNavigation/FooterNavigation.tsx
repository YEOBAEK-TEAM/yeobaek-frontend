import { NavLink } from "react-router-dom";

const navigationItems = [
  { path: "/vocabulary", label: "단어장" },
  { path: "/training", label: "훈련" },
  { path: "/", label: "HOME" },
  { path: "/library", label: "서재" },
  { path: "/my", label: "MY" },
];

export default function FooterNavigation() {
  return (
    <nav className="fixed bottom-0 left-1/2 flex w-full max-w-97.5 -translate-x-1/2 justify-around border-t bg-white">
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-1 justify-center py-4 text-sm ${
              isActive ? "font-bold text-black" : "text-gray-400"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
