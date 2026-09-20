import type { ReactNode } from "react";

type BookSelectSectionProps = {
  title: string;
  isEmpty: boolean;
  emptyText: string;
  children: ReactNode;
};

export default function BookSelectSection({
  title,
  isEmpty,
  emptyText,
  children,
}: BookSelectSectionProps) {
  return (
    <section className="px-5 pt-8">
      <h2 className="px-1 text-[18px] font-bold text-[#4F4D4E]">{title}</h2>

      {isEmpty ? (
        <p className="px-1 py-8 text-center text-[14px] text-[#ABA394]">{emptyText}</p>
      ) : (
        <div role="radiogroup" aria-label={title} className="mt-4">
          {children}
        </div>
      )}
    </section>
  );
}
