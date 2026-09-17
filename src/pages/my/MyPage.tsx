import Header from "@/components/common/header/Header";
import ProfileCard from "@/components/my/ProfileCard";
import ReadingStats from "@/components/my/ReadingStats";
import ActivityMenu from "@/components/my/ActivityMenu";
import MonthlyReadingSummary from "@/components/my/MonthlyReadingSummary";
import WeeklyReadingChart from "@/components/my/WeeklyReadingChart";
import CategoryReadingChart from "@/components/my/CategoryReadingChart";

import { useAuthStore } from "@/stores/auth";

import { myProfile, mockReadingDays, myReferenceDate, readingCategories } from "@/mocks/my";

export default function MyPage() {
  const nickname = useAuthStore((state) => state.nickname);

  const profile = {
    ...myProfile,
    nickname: nickname ?? myProfile.nickname,
  };

  const days = mockReadingDays.filter((day) => day.date.startsWith(myReferenceDate.slice(0, 7)));

  return (
    <main className="flex-1 text-[#30201D]">
      <Header title="MY" />
      <ProfileCard profile={profile} />
      <ReadingStats profile={profile} />
      <ActivityMenu />
      <MonthlyReadingSummary month={Number(myReferenceDate.slice(5, 7))} days={days} />
      <WeeklyReadingChart days={days} referenceDate={myReferenceDate} />
      <CategoryReadingChart categories={readingCategories} />
    </main>
  );
}
