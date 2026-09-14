import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-97.5 px-5 py-5 bg-white">
      <Outlet />
    </div>
  );
}
