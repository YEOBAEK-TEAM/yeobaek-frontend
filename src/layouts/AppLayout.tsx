import { Outlet } from "react-router-dom";

import ToastHost from "@/components/common/toast/ToastHost";

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#FFFEFB]">
      <Outlet />
      <ToastHost />
    </div>
  );
}
