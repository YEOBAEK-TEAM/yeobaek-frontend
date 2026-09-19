export type MockBookRating = {
  rating: number;
  ratingCount: number;
};

const mockBookRatings: Record<number, MockBookRating> = {
  1: { rating: 4.3, ratingCount: 1234 },
  2: { rating: 4.7, ratingCount: 856 },
  3: { rating: 4.1, ratingCount: 245 },
};

const defaultMockBookRating: MockBookRating = { rating: 4.3, ratingCount: 1234 };

// Keep the temporary rating source separate from the book detail API.
export const getMockBookRating = (bookId: number): MockBookRating =>
  mockBookRatings[bookId] ?? defaultMockBookRating;
