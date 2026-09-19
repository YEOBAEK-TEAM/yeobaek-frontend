import Header from "@/components/common/header/Header";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import ProfileCard from "@/components/my/ProfileCard";
import ReadingStats from "@/components/my/ReadingStats";
import ActivityMenu from "@/components/my/ActivityMenu";
import MonthlyReadingSummary from "@/components/my/MonthlyReadingSummary";
import WeeklyReadingChart from "@/components/my/WeeklyReadingChart";
import CategoryReadingChart from "@/components/my/CategoryReadingChart";

import { useMyPage } from "@/hooks/useMyPage";

import { readingCategories } from "@/mocks/my";

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const { data: profile, isPending, isError, refetch } = useMyPage();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <main className="flex-1 text-[#30201D]">
      <Header title="MY" />
      {isPending && (
        <p role="status" className="px-6 py-12 text-center text-sm">
          마이페이지 정보를 불러오는 중입니다.
        </p>
      )}
      {isError && (
        <div role="alert" className="px-6 py-8 text-center text-sm">
          <p>마이페이지 정보를 불러오지 못했습니다.</p>
          <button type="button" className="mt-2 underline" onClick={() => void refetch()}>
            다시 시도
          </button>
        </div>
      )}
      {profile && (
        <>
          <ProfileCard profile={profile} onLogout={handleLogout} />
          <ReadingStats profile={profile} />
        </>
      )}
      <ActivityMenu />
      {profile && (
        <>
          <MonthlyReadingSummary record={profile.monthlyRecord} />
          <WeeklyReadingChart weeklyPages={profile.weeklyPages} />
        </>
      )}
      <CategoryReadingChart categories={readingCategories} />
    </main>
  );
}
