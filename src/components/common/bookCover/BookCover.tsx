type BookCoverProps = {
  src: string;
  framed?: boolean;
  className?: string;
};

// 책 표지 공용 표시
export default function BookCover({ src, framed, className = "" }: BookCoverProps) {
  return (
    <img
      src={src}
      alt=""
      className={`object-cover ${framed ? "border border-[#E0DDCE]" : ""} ${className}`}
    />
  );
}
