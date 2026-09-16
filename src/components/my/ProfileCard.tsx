import { Flame, Settings, UserRound } from "lucide-react";
import type { MyProfile } from "@/types/my";
export default function ProfileCard({ profile }: { profile: MyProfile }) {
  return (
    <section aria-label="내 프로필" className="flex items-center gap-5 px-6 pt-6">
      <div
        role="img"
        aria-label="기본 프로필 이미지"
        className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#585640] text-[#D9DFC3]"
      >
        <UserRound size={62} strokeWidth={1.5} />
      </div>
      <div>
        <div className="flex items-center gap-0">
          <h2 className="text-2xl font-bold text-black">{profile.nickname}</h2>
          <button
            type="button"
            aria-label="설정"
            className="flex size-10 items-center justify-center"
          >
            <Settings size={23} />
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1 rounded bg-[#F7F5F0] px-2 py-1 text-sm font-bold text-black">
          <Flame className="text-orange-500" size={25} fill="currentColor" />
          연속 {profile.consecutiveDays}일째 독서중
        </p>
      </div>
    </section>
  );
}
