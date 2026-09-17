import ProfileAvatar from "@/components/training/discussion/shared/ProfileAvatar";
import { HOST_LABEL } from "@/constants/training/discussion/room";

type HostProfileProps = {
  nickname: string;
  imageUrl: string | null;
};

export default function HostProfile({ nickname, imageUrl }: HostProfileProps) {
  return (
    <div>
      <p className="text-[14px] font-semibold text-[#2C2A2B]">{HOST_LABEL}</p>

      <div className="mt-2 flex items-center gap-2.5">
        <ProfileAvatar src={imageUrl} className="h-12 w-12" />
        <p className="truncate text-[15px] font-semibold text-[#2C2A2B]">{nickname}</p>
      </div>
    </div>
  );
}
