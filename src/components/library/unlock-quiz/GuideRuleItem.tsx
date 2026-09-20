import { CircleCheck } from "lucide-react";

type GuideRuleItemProps = {
  text: string;
};

export default function GuideRuleItem({ text }: GuideRuleItemProps) {
  return (
    <li className="flex min-h-13 items-center gap-3 rounded-xl bg-[#F7F6F1] py-2 pr-3 pl-4">
      <CircleCheck
        aria-hidden="true"
        strokeWidth={1.25}
        className="h-9 w-9 shrink-0 text-[#CFCABB]"
      />
      <span className="text-[12px] leading-4 font-medium break-keep text-[#2C2A2B]">{text}</span>
    </li>
  );
}
