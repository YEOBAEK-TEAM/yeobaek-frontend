import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/home/HomePage";
import LibraryPage from "@/pages/library/LibraryPage";
import MyPage from "@/pages/my/MyPage";
import TrainingPage from "@/pages/training/TrainingPage";
import VocabularyPage from "@/pages/vocabulary/VocabularyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/my" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
