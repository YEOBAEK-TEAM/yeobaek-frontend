import RitiMessage from "@/components/training/shared/chat/RitiMessage";

type NoticeMessageProps = {
  text: string;
};

export default function NoticeMessage({ text }: NoticeMessageProps) {
  return (
    <RitiMessage>
      <p className="mr-3.5 rounded-xl bg-[#DEE2D0] px-4 py-2.5 text-[16px] leading-5 break-keep text-[#2C2A2B]">
        {text}
      </p>
    </RitiMessage>
  );
}
