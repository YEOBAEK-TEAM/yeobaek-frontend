import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import SectionHeader from "@/components/common/section/SectionHeader";
import SectionState from "@/components/common/section/SectionState";
import FolderBanner from "@/components/home/folder/FolderBanner";
import TodaySentenceCard from "@/components/home/sentence/TodaySentenceCard";
import BookShelfCarousel from "@/components/home/taste/BookShelfCarousel";
import TasteBookTopSheet from "@/components/home/taste/TasteBookTopSheet";
import { HOME_TITLE, TASTE_SECTION_ACTION } from "@/constants/home/home";
import {
  useReadingProgress,
  useRecentReport,
  useTasteBooks,
  useTodaySentence,
} from "@/hooks/home/useHomeQueries";
import { LIBRARY_REPORT_TAB_STATE, REPORT_WRITE_PATH } from "@/constants/library/report";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";
import { useFolderBannerStore } from "@/stores/home/folderBanner";

export default function HomePage() {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const readingQuery = useReadingProgress();
  const reportQuery = useRecentReport();
  const sentenceQuery = useTodaySentence();
  const tasteQuery = useTasteBooks();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const tasteBooks = tasteQuery.data ?? [];

  const activeTab = useFolderBannerStore((state) => state.activeTab);

  const isBannerBlocked =
    readingQuery.isPending || reportQuery.isPending || readingQuery.isError || reportQuery.isError;

  const goBookDetail = (bookId: number) => navigate(`/library/books/${bookId}`);

  // 독후감 쓰기는 서재 독후감 탭에서 책 선택 시트까지 열기
  const handleFolderLink = () =>
    activeTab === "report"
      ? navigate(REPORT_WRITE_PATH, { state: LIBRARY_REPORT_TAB_STATE })
      : navigate("/library");

  return (
    <main className="flex-1 pb-8">
      {/* 상단 헤더 */}
      <Header title={HOME_TITLE} action="bell" className="px-5 pt-14 pb-5" />

      <div className="mt-8">
        {isBannerBlocked ? (
          <div className="px-5">
            <SectionState
              isError={readingQuery.isError || reportQuery.isError}
              onRetry={() => {
                void readingQuery.refetch();
                void reportQuery.refetch();
              }}
              className="h-49"
            />
          </div>
        ) : (
          <FolderBanner
            nickname={nickname}
            progress={readingQuery.data ?? null}
            report={reportQuery.data ?? null}
            onLinkClick={handleFolderLink}
          />
        )}
      </div>

      <div className="mt-7">
        {sentenceQuery.isPending || sentenceQuery.isError ? (
          <div className="px-5">
            <SectionState
              isError={sentenceQuery.isError}
              onRetry={() => void sentenceQuery.refetch()}
              className="h-45"
            />
          </div>
        ) : (
          <TodaySentenceCard sentence={sentenceQuery.data} />
        )}
      </div>

      <section className="mt-9">
        <SectionHeader
          title={`${nickname}님의 취향을 반영한 도서`}
          actionLabel={TASTE_SECTION_ACTION}
          // 추천을 불러오기 전에는 시트를 열지 않음
          onAction={() => tasteBooks.length > 0 && setIsSheetOpen(true)}
        />

        <div className="mt-4">
          {tasteQuery.isError ? (
            <div className="px-5">
              <SectionState isError onRetry={() => void tasteQuery.refetch()} className="h-45" />
            </div>
          ) : (
            <BookShelfCarousel
              books={tasteBooks}
              isPending={tasteQuery.isPending}
              onSelect={goBookDetail}
            />
          )}
        </div>
      </section>

      {isSheetOpen && (
        <TasteBookTopSheet
          books={tasteBooks}
          onSelect={goBookDetail}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </main>
  );
}
