import type { ReactNode } from "react";

type BookMetaProps = {
  title: string;
  author: string;
  trailing?: ReactNode;
  className?: string;
};

export default function BookMeta({ title, author, trailing, className = "" }: BookMetaProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-[16px] leading-6 font-bold text-[#4F4D4E]">
          {title}
        </h3>

        {trailing}
      </div>

      <p className="truncate text-[14px] leading-5.5 font-medium text-[#54555A]">{author}</p>
    </div>
  );
}
