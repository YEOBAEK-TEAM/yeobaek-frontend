import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import FooterLayout from "@/layouts/FooterLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";

import SplashPage from "@/pages/splash/SplashPage";
import LoginPage from "@/pages/login/LoginPage";

import HomePage from "@/pages/home/HomePage";

import LibraryPage from "@/pages/library/LibraryPage";
import BookReadPage from "@/pages/library/BookReadPage";
import BookSearchPage from "@/pages/library/BookSearchPage";
import BookDetailPage from "@/pages/library/BookDetailPage";
import ReportEditorPage from "@/pages/library/ReportEditorPage";
import UnlockQuizPage from "@/pages/library/UnlockQuizPage";

import MyPage from "@/pages/my/MyPage";
import ReadingCalendarPage from "@/pages/my/ReadingCalendarPage";
import LikedCommentsPage from "@/pages/my/LikedCommentsPage";
import LikedPagesPage from "@/pages/my/LikedPagesPage";
import LikedBookPagesPage from "@/pages/my/LikedBookPagesPage";
import BookmarkedPagesPage from "@/pages/my/BookmarkedPagesPage";
import BookmarkedBookPagesPage from "@/pages/my/BookmarkedBookPagesPage";

import TrainingPage from "@/pages/training/TrainingPage";
import BookReportSelectPage from "@/pages/training/BookReportSelectPage";
import BookReportChatPage from "@/pages/training/BookReportChatPage";
import TrainingHistoryPage from "@/pages/training/TrainingHistoryPage";
import TrainingCompletePage from "@/pages/training/TrainingCompletePage";
import ComprehensionSelectPage from "@/pages/training/ComprehensionSelectPage";
import ComprehensionChatPage from "@/pages/training/ComprehensionChatPage";
import ComprehensionCompletePage from "@/pages/training/ComprehensionCompletePage";
import RoomCreatePage from "@/pages/training/RoomCreatePage";
import RoomCreateCompletePage from "@/pages/training/RoomCreateCompletePage";
import RoomListPage from "@/pages/training/RoomListPage";
import DiscussionRoomPage from "@/pages/training/DiscussionRoomPage";

import VocabularyPage from "@/pages/vocabulary/VocabularyPage";
import WordDetailPage from "@/pages/vocabulary/WordDetailPage";
import SentenceDetailPage from "@/pages/vocabulary/SentenceDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* 로그인 없이 접근 가능한 페이지 */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 로그인한 사용자만 접근 가능한 페이지 */}
          <Route element={<ProtectedRoute />}>
            {/* Footer 없는 페이지 */}

            {/* 서재 */}
            <Route path="/library/read" element={<BookReadPage />} />
            <Route path="/library/search" element={<BookSearchPage />} />
            <Route path="/library/books/:bookId" element={<BookDetailPage />} />
            <Route path="/library/books/:bookId/unlock-quiz" element={<UnlockQuizPage />} />
            <Route path="/library/reports/new" element={<ReportEditorPage />} />
            <Route path="/library/reports/:reportId" element={<ReportEditorPage />} />

            {/* 단어장 상세 */}
            <Route path="/vocabulary/word/:id" element={<WordDetailPage />} />

            {/* 마이페이지 상세 */}
            <Route path="/my/calendar" element={<ReadingCalendarPage />} />
            <Route path="/my/liked-comments" element={<LikedCommentsPage />} />
            <Route path="/my/liked-pages" element={<LikedPagesPage />} />
            <Route path="/my/liked-pages/:bookId" element={<LikedBookPagesPage />} />
            <Route path="/my/training-history" element={<TrainingHistoryPage />} />
            <Route path="/my/bookmarked-pages" element={<BookmarkedPagesPage />} />
            <Route path="/my/bookmarked-pages/:bookId" element={<BookmarkedBookPagesPage />} />

            {/* 훈련 */}
            <Route path="/training/book-report/select" element={<BookReportSelectPage />} />
            <Route path="/training/book-report" element={<BookReportChatPage />} />
            <Route path="/training/complete" element={<TrainingCompletePage />} />
            <Route path="/training/comprehension" element={<ComprehensionSelectPage />} />
            <Route path="/training/comprehension/chat" element={<ComprehensionChatPage />} />
            <Route
              path="/training/comprehension/complete"
              element={<ComprehensionCompletePage />}
            />
            <Route path="/training/discussion/create" element={<RoomCreatePage />} />
            <Route
              path="/training/discussion/create/complete"
              element={<RoomCreateCompletePage />}
            />
            <Route path="/training/discussion/rooms" element={<RoomListPage />} />
            <Route path="/training/discussion/rooms/:roomId" element={<DiscussionRoomPage />} />

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
