import { Flame, Settings } from "lucide-react";

import { useRef } from "react";
import ProfileImage from "./ProfileImage";
import { useUpdateProfileImage } from "@/hooks/useUpdateProfileImage";

import type { MyPageResponse } from "@/types/my";

export default function ProfileCard({
  profile,
}: {
  profile: Pick<MyPageResponse, "nickname" | "profileImageUrl" | "streakDays">;
}) {
  const input = useRef<HTMLInputElement>(null);
  const uploading = useRef(false);
  const upload = useUpdateProfileImage();
  return (
    <>
      <section aria-label="내 프로필" className="flex items-center gap-5 px-6 pt-6">
        <button
          type="button"
          aria-label="프로필 이미지 변경"
          disabled={upload.isPending}
          onClick={() => input.current?.click()}
          className="size-24 shrink-0 rounded-full"
        >
          <ProfileImage
            src={profile.profileImageUrl}
            alt={`${profile.nickname} 프로필`}
            className="size-24 shrink-0 rounded-full object-cover"
          />
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
