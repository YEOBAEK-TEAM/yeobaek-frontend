export default function ReaderCoverPage({ title, coverUrl }: { title: string; coverUrl: string }) {
  return (
    <div className="-mx-5 -my-5 flex h-full w-[calc(100%+40px)] items-center justify-center select-none">
      <img
        src={coverUrl}
        alt={`${title} 책 표지`}
        draggable={false}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
