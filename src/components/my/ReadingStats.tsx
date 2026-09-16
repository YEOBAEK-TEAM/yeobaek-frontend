import type { MyProfile } from "@/types/my";
export default function ReadingStats({ profile }: { profile: MyProfile }) {
  return (
    <dl className="mt-3 grid grid-cols-3 divide-x divide-[#DDD9D2] py-1 text-center">
      {[
        ["완독한 책", profile.completedBooks],
        ["수집한 문장", profile.collectedSentences],
        ["AI 훈련", profile.aiTraining],
      ].map(([label, value]) => (
        <div key={label} className="py-2">
          <dt className="text-sm font-bold text-[#888]">{label}</dt>
          <dd className="mt-4 text-xl font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
