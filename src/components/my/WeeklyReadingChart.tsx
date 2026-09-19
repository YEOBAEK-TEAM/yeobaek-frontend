import { useState } from "react";
import type { WeeklyReadingPage } from "@/types/my";
export default function WeeklyReadingChart({ weeklyPages }: { weeklyPages: WeeklyReadingPage[] }) {
  const [selected, setSelected] = useState(2);
  const values = Array<number>(7).fill(0);
  for (const day of weeklyPages) {
    const weekday = new Date(`${day.date}T12:00:00`).getDay();
    if (!Number.isNaN(weekday)) values[(weekday + 6) % 7] = day.pagesRead;
  }
  const maximum = Math.max(1, ...values);
  return (
    <section
      aria-label="이번 주 요일별 읽은 페이지"
      className="mx-4 mt-5 rounded-xl border border-[#EEECE7] bg-[#F9F8F5] p-4"
    >
      <svg
        viewBox="0 0 320 150"
        className="w-full"
        role="img"
        aria-label={values
          .map((value, i) => `${"월화수목금토일"[i]}요일 ${value}페이지`)
          .join(", ")}
      >
        {[30, 60, 90, 120].map((y) => (
          <line key={y} x1="5" x2="315" y1={y} y2={y} stroke="#E3E1DB" />
        ))}
        {values.map((value, index) => {
          const height = (value / maximum) * 85;
          return (
            <g key={index}>
              <rect
                x={17 + index * 44}
                y={120 - height}
                width="18"
                height={Math.max(1, height)}
                rx="4"
                fill={selected === index ? "#626A4D" : "#9BA28A"}
              />
              <text x={26 + index * 44} y="143" textAnchor="middle" fontSize="13" fill="#808080">
                {"월화수목금토일"[index]}
              </text>
              {selected === index && (
                <text
                  x={26 + index * 44}
                  y={110 - height}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#4F573E"
                >
                  {value}p
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-1 grid grid-cols-7">
        {values.map((value, index) => (
          <button
            key={index}
            type="button"
            aria-label={`${"월화수목금토일"[index]}요일 ${value}페이지 보기`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
            className="rounded py-1 text-xs text-[#747C63] focus-visible:outline-2"
          >
            {value}p
          </button>
        ))}
      </div>
    </section>
  );
}
