import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import BookSelectSection from "@/components/training/comprehension/BookSelectSection";
import BookmarkRangeLabel from "@/components/training/comprehension/BookmarkRangeLabel";
import SelectableBookItem from "@/components/training/comprehension/SelectableBookItem";
import StartButton from "@/components/training/comprehension/StartButton";
import {
  BOOKMARK_EMPTY_TEXT,
  BOOKMARK_SECTION_TITLE,
  COMPREHENSION_TITLE,
  LIBRARY_EMPTY_TEXT,
  LIBRARY_SECTION_TITLE,
} from "@/constants/training/comprehensionChat";
import { useBookmarks, useLibraryBooks } from "@/hooks/training/useComprehensionLibrary";
import { useComprehensionChatStore } from "@/stores/training/comprehensionChat";

const RADIO_NAME = "comprehension-selection";

export default function ComprehensionSelectPage() {
  const navigate = useNavigate();

  const setSelection = useComprehensionChatStore((state) => state.setSelection);

  const { data: books = [] } = useLibraryBooks();
  const { data: bookmarks = [] } = useBookmarks();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // 서재와 책갈피를 통틀어 하나만 선택
  const bookKeys = books.map((book) => `book-${book.bookId}`);
  const bookmarkKeys = bookmarks.map((bookmark) => `bookmark-${bookmark.bookmarkId}`);

  const isDivided = (keys: string[], index: number) =>
    index < keys.length - 1 && selectedKey !== keys[index] && selectedKey !== keys[index + 1];

  const start = () => {
    if (!selectedKey) return;

    const bookmark = bookmarks.find((item) => `bookmark-${item.bookmarkId}` === selectedKey);

    if (bookmark) {
      setSelection({ bookId: bookmark.bookId, bookmarkId: bookmark.bookmarkId });
    } else {
      const book = books.find((item) => `book-${item.bookId}` === selectedKey);
      if (!book) return;

      setSelection({ bookId: book.bookId, bookmarkId: null });
    }

    navigate("/training/comprehension/chat");
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <Header title={COMPREHENSION_TITLE} onBack={() => navigate(-1)} />

      <div className="flex-1 pb-6">
        <BookSelectSection
          title={LIBRARY_SECTION_TITLE}
          isEmpty={books.length === 0}
          emptyText={LIBRARY_EMPTY_TEXT}
        >
          {books.map((book, index) => (
            <SelectableBookItem
              key={book.bookId}
              name={RADIO_NAME}
              value={bookKeys[index]}
              checked={selectedKey === bookKeys[index]}
              divided={isDivided(bookKeys, index)}
              coverUrl={book.coverUrl}
              title={book.title}
              author={book.author}
              onSelect={() => setSelectedKey(bookKeys[index])}
            />
          ))}
        </BookSelectSection>

        <BookSelectSection
          title={BOOKMARK_SECTION_TITLE}
          isEmpty={bookmarks.length === 0}
          emptyText={BOOKMARK_EMPTY_TEXT}
        >
          {bookmarks.map((bookmark, index) => (
            <SelectableBookItem
              key={bookmark.bookmarkId}
              name={RADIO_NAME}
              value={bookmarkKeys[index]}
              checked={selectedKey === bookmarkKeys[index]}
              divided={isDivided(bookmarkKeys, index)}
              coverUrl={bookmark.coverUrl}
              title={
                <span className="flex items-baseline gap-2">
                  {bookmark.title}
                  <BookmarkRangeLabel startPage={bookmark.startPage} endPage={bookmark.endPage} />
                </span>
              }
              author={bookmark.author}
              onSelect={() => setSelectedKey(bookmarkKeys[index])}
            />
          ))}
        </BookSelectSection>
      </div>

      <StartButton disabled={!selectedKey} onClick={start} />
    </main>
  );
}
