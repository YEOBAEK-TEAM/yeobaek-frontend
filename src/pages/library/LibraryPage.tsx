import Header from "@/components/common/header/Header";
import { useNavigate } from "react-router-dom";

export default function LibraryPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      <Header title="내 서재" action="search" />

      <button
        type="button"
        onClick={() => navigate("/library/read")}
        className="mt-10 rounded-lg bg-black px-4 py-2 text-white"
      >
        책 읽으러 가기
      </button>
    </main>
  );
}
