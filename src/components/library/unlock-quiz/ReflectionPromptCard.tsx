import type { LucideIcon } from "lucide-react";

type ReflectionPromptCardProps = {
  icon: LucideIcon;
  text: string;
};

// 독후감 작성 전 생각을 떠올리게 하는 안내 카드
export default function ReflectionPromptCard({ icon: Icon, text }: ReflectionPromptCardProps) {
  return (
    <li className="flex min-h-13 items-center gap-4 rounded-xl bg-[#F0EDE8] py-3 pr-4 pl-6">
      <Icon aria-hidden="true" strokeWidth={1.75} className="h-6.5 w-6.5 shrink-0 text-[#4F4D4E]" />
      <span className="text-[15px] leading-[22px] font-medium break-keep text-[#54555A]">
        {text}
      </span>
    </li>
  );
}
