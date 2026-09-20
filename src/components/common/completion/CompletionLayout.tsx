import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

type CompletionLayoutProps = {
  character: string;
  title: string;
  description?: string;
  characterClassName?: string;
  topClassName?: string;
  celebrate?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
};

// 캐릭터 아래 타원 그림자
const ELLIPSE_SHADOW =
  "radial-gradient(ellipse at center, rgba(79,77,78,0.42) 0%, rgba(79,77,78,0.22) 45%, rgba(79,77,78,0) 74%)";

const CELEBRATE_KEYFRAMES: Keyframe[] = [
  { transform: "scale(0.8) translateY(12px)", opacity: 0 },
  { transform: "scale(1.06) translateY(-4px)", opacity: 1, offset: 0.65 },
  { transform: "scale(1) translateY(0)", opacity: 1 },
];

// 캐릭터·문구·하단 슬롯만 바꿔 쓰는 결과 화면 틀
export default function CompletionLayout({
  character,
  title,
  description,
  characterClassName = "h-48",
  topClassName = "pt-12",
  celebrate = false,
  children,
  footer,
}: CompletionLayoutProps) {
  const characterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!celebrate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    characterRef.current?.animate(CELEBRATE_KEYFRAMES, { duration: 560, easing: "ease-out" });
  }, [celebrate]);

  return (
    <main
      className={`flex min-h-dvh flex-col px-5.5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] ${topClassName}`}
    >
      <div className="flex flex-col items-center">
        <div className="relative flex h-52 w-60 items-end justify-center">
          {/* 캐릭터 뒤 원형 글로우 */}
          <span
            aria-hidden="true"
            className="absolute inset-x-6 top-2 bottom-4 rounded-full bg-[#EDEFE3] blur-2xl"
          />

          <img
            ref={characterRef}
            src={character}
            alt=""
            className={`relative w-auto object-contain mix-blend-multiply ${characterClassName}`}
          />
        </div>

        <span
          aria-hidden="true"
          className="-mt-3 h-4 w-32 rounded-[50%]"
          style={{ background: ELLIPSE_SHADOW }}
        />
      </div>

      <h1 className="mt-5 text-center text-[22px] leading-[30px] font-bold break-keep whitespace-pre-line text-[#1E1E1E]">
        {title}
      </h1>

      {description && (
        <p className="mt-4 text-center text-[17px] leading-6 font-medium break-keep whitespace-pre-line text-[#6B6B6B]">
          {description}
        </p>
      )}

      <div className="flex flex-1 flex-col">{children}</div>

      {footer && <div className="shrink-0 pt-6">{footer}</div>}
    </main>
  );
}
