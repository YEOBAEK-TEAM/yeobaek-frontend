import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@/pages/home/HomePage";
import LibraryPage from "@/pages/library/LibraryPage";
import MyPage from "@/pages/my/MyPage";
import TrainingPage from "@/pages/training/TrainingPage";
import VocabularyPage from "@/pages/vocabulary/VocabularyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/my" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
