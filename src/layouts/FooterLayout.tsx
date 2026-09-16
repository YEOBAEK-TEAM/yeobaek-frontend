import { Outlet } from "react-router-dom";

import FooterNavigation from "@/components/common/footerNavigation/FooterNavigation";

export default function FooterLayout() {
  return (
    <div className="flex min-h-dvh flex-col pb-22">
      <Outlet />
      <FooterNavigation />
    </div>
  );
}
