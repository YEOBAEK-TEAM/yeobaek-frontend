import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { books } from "@/mocks/books";

type LibraryState = {
  addedBookIds: number[];
  addBook: (id: number) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set) => ({
      addedBookIds: [],
      addBook: (id) =>
        set((state) => ({
          addedBookIds:
            books.some((book) => book.id === id && !book.isInLibrary) &&
            !state.addedBookIds.includes(id)
              ? [...state.addedBookIds, id]
              : state.addedBookIds,
        })),
    }),
    {
      name: "yeobaek-library-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ addedBookIds: state.addedBookIds }),
      merge: (persisted, current) => {
        const ids = (persisted as Partial<LibraryState> | null)?.addedBookIds;
        return {
          ...current,
          addedBookIds: Array.isArray(ids)
            ? ids.filter(
                (id): id is number =>
                  typeof id === "number" && books.some((book) => book.id === id),
              )
            : [],
        };
      },
    },
  ),
);
