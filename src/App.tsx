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
import TrainingPage from "@/pages/training/TrainingPage";
import VocabularyPage from "@/pages/vocabulary/VocabularyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Footer 없는 페이지 */}
          <Route path="/library/read" element={<BookReadPage />} />
          <Route path="/library/search" element={<BookSearchPage />} />
          <Route path="/library/books/:bookId" element={<BookDetailPage />} />
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Footer 있는 페이지 */}
          <Route element={<FooterLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/vocabulary" element={<VocabularyPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/my" element={<MyPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
