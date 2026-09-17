import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import BookCover from "@/components/common/bookCover/BookCover";
import InviteCodeBox from "@/components/training/discussion/create/InviteCodeBox";
import RoomCreatedHero from "@/components/training/discussion/create/RoomCreatedHero";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";
import { ROOM_CREATED } from "@/constants/training/discussion/room";
import { useDiscussionTabStore } from "@/stores/training/discussion/discussionTab";
import { useToastStore } from "@/stores/common/toast";
import { useRoomCreateStore } from "@/stores/training/discussion/roomCreate";
import { useTrainingStore } from "@/stores/training/trainingTab";

export default function RoomCreateCompletePage() {
  const navigate = useNavigate();

  const createdRoom = useRoomCreateStore((state) => state.createdRoom);
  const clearForm = useRoomCreateStore((state) => state.clearForm);
  const showToast = useToastStore((state) => state.showToast);
  const setActiveTab = useTrainingStore((state) => state.setActiveTab);
  const setActiveSubTab = useDiscussionTabStore((state) => state.setActiveSubTab);

  // 생성 완료 후 입력값만 비우고 완료 정보는 유지
  useEffect(() => {
    clearForm();
  }, [clearForm]);

  // 방 정보 단계에서 내려간 스크롤을 초기화해 캐릭터부터 노출
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!createdRoom) return <Navigate to="/training" replace />;

  // 토론장 내 그룹 탭에서 만든 방과 완료 토스트 확인
  const goHome = () => {
    setActiveTab("debate");
    setActiveSubTab("joined");
    showToast(ROOM_CREATED.toastText);
    navigate("/training", { replace: true });
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex-1 pt-30">
        <RoomCreatedHero />

        <div className="mt-12 flex items-center gap-4 px-12">
          <BookCover src={createdRoom.coverUrl} className="h-23.5 w-16 shrink-0 rounded-md" />

          <p className="flex-1 text-center text-[20px] leading-7 font-bold break-keep text-[#2C2A2B]">
            {createdRoom.title}
          </p>
        </div>

        {createdRoom.inviteCode && (
          <div className="mt-6">
            <InviteCodeBox code={createdRoom.inviteCode} />
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2.5 px-5 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={() => navigate(DISCUSSION_PATH.room(createdRoom.roomId), { replace: true })}
          className="h-13.5 rounded-2xl border-[1.5px] border-[#4F4D4E] bg-white text-[18px] font-bold text-[#4F4D4E]"
        >
          {ROOM_CREATED.enterLabel}
        </button>

        <button
          type="button"
          onClick={goHome}
          className="h-13.5 rounded-2xl bg-[#B8BC9F] text-[18px] font-bold text-white"
        >
          {ROOM_CREATED.homeLabel}
        </button>
      </div>
    </main>
  );
}
