import { useId, type ReactNode } from "react";

type GroupSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function GroupSection({ title, description, children }: GroupSectionProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId}>
      <div className="px-7.5">
        <h2 id={titleId} className="text-[20px] leading-7 font-bold text-[#4F4D4E]">
          {title}
        </h2>

        <p className="mt-1 text-[14px] leading-5 font-medium tracking-[-0.03em] break-keep text-[#54555A]">
          {description}
        </p>
      </div>

      <div className="mt-1">{children}</div>
    </section>
  );
}
