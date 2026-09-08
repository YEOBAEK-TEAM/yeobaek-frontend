import Header from "@/components/common/header/Header";

export default function VocabularyPage() {
  return (
    <main className="min-h-screen">
      {/*여기 이름 나중에 API 연동할 때 유저 이름으로 바꿔야 됨*/}
      <Header title="서후의 글귀 수집" />
      <h1>단어장</h1>
    </main>
  );
}
