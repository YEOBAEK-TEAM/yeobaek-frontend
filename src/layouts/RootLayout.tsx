import { Outlet } from "react-router-dom";

import FooterNavigation from "@/components/common/footerNavigation/FooterNavigation";

export default function RootLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-97.5 px-5 py-5 bg-[#F7F6F1]">
      <Outlet />
      <FooterNavigation />
    </div>
  );
}
