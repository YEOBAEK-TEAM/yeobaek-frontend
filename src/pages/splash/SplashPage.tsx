import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import splashLogo from "@/assets/icons/splashLogo.png";
import splashBackground from "@/assets/images/splash/splashBackground.jpg";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden">
      {/* 배경 */}
      <img
        src={splashBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 로고 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <img src={splashLogo} alt="여백" className="w-20 object-contain" />

        <h1 className="mt-3 text-[32px] font-bold text-[#4F4D4E]">여백</h1>
      </div>
    </main>
  );
}
