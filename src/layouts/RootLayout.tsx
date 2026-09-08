import { Outlet } from "react-router-dom";

import FooterNavigation from "@/components/common/footerNavigation/FooterNavigation";
import Header from "@/components/common/header/Header";

export default function RootLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-97.5 px-5 py-5 bg-white">
      <Header />
      <Outlet />
      <FooterNavigation />
    </div>
  );
}
