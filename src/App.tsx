import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import FooterLayout from "@/layouts/FooterLayout";

import SplashPage from "@/pages/splash/SplashPage";
import LoginPage from "@/pages/login/LoginPage";

import HomePage from "@/pages/home/HomePage";
import LibraryPage from "@/pages/library/LibraryPage";
import BookReadPage from "@/pages/library/BookReadPage";
import BookSearchPage from "@/pages/library/BookSearchPage";
import BookDetailPage from "@/pages/library/BookDetailPage";
import MyPage from "@/pages/my/MyPage";
import ReadingCalendarPage from "@/pages/my/ReadingCalendarPage";
import LikedCommentsPage from "@/pages/my/LikedCommentsPage";
import LikedPagesPage from "@/pages/my/LikedPagesPage";
import LikedBookPagesPage from "@/pages/my/LikedBookPagesPage";
import BookmarkedPagesPage from "@/pages/my/BookmarkedPagesPage";
import BookmarkedBookPagesPage from "@/pages/my/BookmarkedBookPagesPage";
import MyActivityProvider from "@/components/my/MyActivityProvider";
import TrainingPage from "@/pages/training/TrainingPage";
import VocabularyPage from "@/pages/vocabulary/VocabularyPage";
import WordDetailPage from "@/pages/vocabulary/WordDetailPage";
import SentenceDetailPage from "@/pages/vocabulary/SentenceDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <MyActivityProvider>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Footer 없는 페이지 */}
            <Route path="/library/read" element={<BookReadPage />} />
            <Route path="/library/search" element={<BookSearchPage />} />
            <Route path="/library/books/:bookId" element={<BookDetailPage />} />
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/vocabulary/word/:id" element={<WordDetailPage />} />
            <Route path="/my/calendar" element={<ReadingCalendarPage />} />
            <Route path="/my/liked-comments" element={<LikedCommentsPage />} />
            <Route path="/my/liked-pages" element={<LikedPagesPage />} />
            <Route path="/my/liked-pages/:bookId" element={<LikedBookPagesPage />} />
            <Route path="/my/bookmarked-pages" element={<BookmarkedPagesPage />} />
            <Route path="/my/bookmarked-pages/:bookId" element={<BookmarkedBookPagesPage />} />

            {/* Footer 있는 페이지 */}
            <Route element={<FooterLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/vocabulary/sentence/:id" element={<SentenceDetailPage />} />
              <Route path="/training" element={<TrainingPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/my" element={<MyPage />} />
            </Route>
          </Route>
        </Routes>
      </MyActivityProvider>
    </BrowserRouter>
  );
}
