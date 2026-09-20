type EmptyMessageProps = {
  text: string;
  className?: string;
};

export default function EmptyMessage({ text, className = "py-18" }: EmptyMessageProps) {
  return (
    <p className={`text-center text-[16px] font-medium break-keep text-[#54555A] ${className}`}>
      {text}
    </p>
  );
}
