// 목 API끼리 완독·해금 기록을 공유하는 메모리, 서버 연동 시 제거
const completedByBookId = new Map<number, { completedAt: string; bookTitle: string | null }>();
const unlockedAtByBookId = new Map<number, string>();

// 뷰어에서 받은 실제 책 제목을 목 문제·해금예정 목록에 사용
export const rememberCompleted = (bookId: number, bookTitle: string | null) => {
  if (!completedByBookId.has(bookId)) {
    completedByBookId.set(bookId, { completedAt: new Date().toISOString(), bookTitle });
  }
};

export const isRememberedCompleted = (bookId: number) => completedByBookId.has(bookId);

export const getRememberedCompletion = (bookId: number) => completedByBookId.get(bookId) ?? null;

export const getRememberedCompletions = () => [...completedByBookId.entries()];

export const rememberUnlocked = (bookId: number) =>
  unlockedAtByBookId.set(bookId, new Date().toISOString());

export const getRememberedUnlocks = () => [...unlockedAtByBookId.entries()];
