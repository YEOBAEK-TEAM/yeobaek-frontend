import { Camera, Flame, Settings } from "lucide-react";
import logoutIcon from "@/assets/icons/logoutIcon.png";

import { useRef } from "react";
import ProfileImage from "./ProfileImage";
import { useUpdateProfileImage } from "@/hooks/useUpdateProfileImage";

import type { MyPageResponse } from "@/types/my";

export default function ProfileCard({
  profile,
  onLogout,
}: {
  profile: Pick<MyPageResponse, "nickname" | "profileImageUrl" | "streakDays">;
  onLogout: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const uploading = useRef(false);
  const upload = useUpdateProfileImage();
  return (
    <>
      <section aria-label="내 프로필" className="flex items-center gap-5 px-6 pt-6">
        <button
          type="button"
          aria-label="프로필 사진 변경"
          disabled={upload.isPending}
          onClick={() => input.current?.click()}
          className="relative size-24 shrink-0 cursor-pointer rounded-full disabled:cursor-default"
        >
          <ProfileImage
            src={profile.profileImageUrl}
            alt={`${profile.nickname} 프로필`}
            className="size-24 shrink-0 rounded-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#595854] text-white shadow-sm"
          >
            <Camera size={16} />
          </span>
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={upload.isPending}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (!file || uploading.current) return;
            uploading.current = true;
            upload.mutate(file, {
              onSettled: () => {
                uploading.current = false;
              },
            });
          }}
        />

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
            <button
              type="button"
              aria-label="로그아웃"
              onClick={onLogout}
              className="-ml-2 flex size-10 shrink-0 items-center justify-center"
            >
              <img src={logoutIcon} alt="" className="size-6 object-contain" />
            </button>
          </div>

          <p className="mt-2 flex items-center gap-1 rounded bg-[#F7F5F0] px-2 py-1 text-sm font-bold text-black">
            <Flame className="text-orange-500" size={25} fill="currentColor" />
            연속 {profile.streakDays}일째 독서중
          </p>
        </div>
      </section>
      {upload.isPending && (
        <p role="status" className="px-6 pt-2 text-sm">
          프로필 이미지를 변경하는 중입니다.
        </p>
      )}
      {upload.isError && (
        <p role="alert" className="px-6 pt-2 text-sm text-red-700">
          프로필 이미지를 변경하지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
    </>
  );
}
