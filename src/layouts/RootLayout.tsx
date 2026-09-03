import { Outlet } from "react-router-dom";

import FooterNavigation from "@/components/common/footerNavigation/FooterNavigation";

export default function RootLayout() {
  return (
    <>
      <Outlet />

      {/* 하단 네비게이션 */}
      <FooterNavigation />
    </>
  );
}
