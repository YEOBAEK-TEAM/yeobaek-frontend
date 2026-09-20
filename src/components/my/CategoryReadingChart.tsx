import type { ReadingCategory } from "@/types/my";
export default function CategoryReadingChart({ categories }: { categories: ReadingCategory[] }) {
  return (
    <section className="mt-7 px-5 pb-10">
      <h2 className="px-3 text-base font-bold">카테고리별 독서비율</h2>
      <div className="mt-6 flex items-center gap-6 bg-[#FAF9F6] py-3">
        <svg
          viewBox="0 0 120 120"
          role="img"
          aria-label="카테고리별 독서 비율"
          className="w-1/2 shrink-0 -rotate-90"
        >
          {categories.map((category, index) => {
            const start = categories
              .slice(0, index)
              .reduce((sum, item) => sum + item.percentage, 0);
            return (
              <circle
                key={category.name}
                cx="60"
                cy="60"
                r="45"
                pathLength="100"
                fill="none"
                stroke={category.color}
                strokeWidth="24"
                strokeDasharray={`${category.percentage} ${100 - category.percentage}`}
                strokeDashoffset={-start}
              />
            );
          })}
        </svg>
        <ul className="flex-1 space-y-3 pr-2">
          {categories.map((category) => (
            <li key={category.name} className="flex items-center gap-2 text-sm text-[#777]">
              <svg width="14" height="14" aria-hidden="true">
                <rect width="14" height="14" rx="4" fill={category.color} />
              </svg>
              <span>{category.name}</span>
              <span className="ml-auto">{category.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
