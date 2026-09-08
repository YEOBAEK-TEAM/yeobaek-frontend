import { Outlet } from "react-router-dom";

import FooterNavigation from "@/components/common/footerNavigation/FooterNavigation";

export default function FooterLayout() {
  return (
    <div className="pb-10">
      <Outlet />
      <FooterNavigation />
    </div>
  );
}
