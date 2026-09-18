export type ContentSentence = {
  sentenceId: number;
  sentenceIndex: number;
  content: string;
  status: string;
  highlightColor: string | null;
};

export type ContentChapterPage = {
  pageId: number;
  bookId: number;
  pageNumber: number;
  chapter: string;
  imageUrl: string | null;
  sentences: ContentSentence[];
};

export type ContentPage = ContentChapterPage & {
  bookmarked: boolean;
  liked: boolean;
  commentCount: number;
};

export type ContentChapter = {
  chapter: string;
  allPage: number;
  pages: ContentChapterPage[];
};
