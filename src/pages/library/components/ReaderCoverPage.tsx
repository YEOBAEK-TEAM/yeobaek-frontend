export default function ReaderCoverPage({
  title,
  author,
  coverUrl,
}: {
  title: string;
  author?: string;
  coverUrl: string;
}) {
  return (
    <div
      className="-mx-5 -my-5 flex h-full w-[calc(100%+40px)] items-center justify-center select-none"
      aria-label={author ? `${title}, ${author}` : title}
    >
      <img
        src={coverUrl}
        alt={`${title} 책 표지`}
        draggable={false}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
