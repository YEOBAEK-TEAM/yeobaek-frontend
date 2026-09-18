import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import FunnelFooterButton from "@/components/training/discussion/create/FunnelFooterButton";
import RoomInfoStep from "@/components/training/discussion/create/RoomInfoStep";
import StepHeader from "@/components/training/discussion/create/StepHeader";
import StepProgressBar from "@/components/common/progress/StepProgressBar";
import TopicStep from "@/components/training/discussion/create/TopicStep";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";
import {
  CREATE_ROOM_LABEL,
  NEXT_STEP_LABEL,
  ROOM_CREATE_ERROR_MESSAGE,
  ROOM_CREATE_EXIT_MESSAGE,
  ROOM_CREATE_TITLE,
  ROOM_CREATE_TOTAL_STEPS,
} from "@/constants/training/discussion/room";
import { useBackGuard } from "@/hooks/common/useBackGuard";
import { useCreateStep } from "@/hooks/training/discussion/useCreateStep";
import { useCreateRoom } from "@/hooks/training/discussion/useRoomMutations";
import { useRoomCreateStore } from "@/stores/training/discussion/roomCreate";
import { canSubmitRoomInfo, hasRoomCreateInput } from "@/utils/training/discussion/roomForm";
import { toCreateRoomRequest } from "@/utils/training/discussion/toRoomView";

export default function RoomCreatePage() {
  const navigate = useNavigate();

  const { step, goNext, goBack } = useCreateStep();

  const form = useRoomCreateStore();
  const createRoom = useCreateRoom();

  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  // 입력한 내용이 있는 1단계에서만 폰·브라우저 뒤로가기도 이탈 확인
  const { release } = useBackGuard(step === 1 && hasRoomCreateInput(form), () =>
    setIsExitConfirmOpen(true),
  );

  // 완료 후 뒤로가기로 돌아온 경우 폼 대신 훈련 페이지로 이동
  const [isAlreadyCreated] = useState(() => useRoomCreateStore.getState().createdRoom !== null);

  useEffect(() => {
    if (!isAlreadyCreated) return;

    useRoomCreateStore.getState().reset();
    navigate("/training", { replace: true });
  }, [isAlreadyCreated, navigate]);

  if (isAlreadyCreated) return null;

  // 새로고침 등으로 주제 없이 2단계에 들어오면 1단계로
  if (step === 2 && !form.topic) return <Navigate to={{ search: "" }} replace />;

  const handleBack = () => {
    if (step === 1 && hasRoomCreateInput(form)) {
      setIsExitConfirmOpen(true);
      return;
    }

    goBack();
  };

  const exit = () => {
    setIsExitConfirmOpen(false);
    release(() => {
      form.reset();
      goBack();
    });
  };

  const submit = () => {
    const { topic } = form;
    if (!topic || createRoom.isPending) return;

    createRoom.mutate(toCreateRoomRequest({ ...form, topic }), {
      onSuccess: ({ roomId, inviteCode }) => {
        form.complete({ roomId, inviteCode, title: form.title.trim(), coverUrl: topic.coverUrl });
        navigate(DISCUSSION_PATH.createComplete, { replace: true });
      },
    });
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <StepHeader
        title={ROOM_CREATE_TITLE}
        step={step}
        totalSteps={ROOM_CREATE_TOTAL_STEPS}
        onBack={handleBack}
      />

      <StepProgressBar step={step} totalSteps={ROOM_CREATE_TOTAL_STEPS} />

      <div className="flex-1 pb-6">
        {step === 1 ? (
          <TopicStep selectedKey={form.topic?.key ?? null} onSelect={form.setTopic} />
        ) : (
          <RoomInfoStep />
        )}
      </div>

      {createRoom.isError && (
        <p role="alert" className="px-5 text-center text-[13px] text-[#D91414]">
          {ROOM_CREATE_ERROR_MESSAGE}
        </p>
      )}

      {step === 1 ? (
        <FunnelFooterButton
          label={NEXT_STEP_LABEL}
          disabled={!form.topic}
          onClick={() => release(goNext)}
        />
      ) : (
        <FunnelFooterButton
          label={CREATE_ROOM_LABEL}
          disabled={!canSubmitRoomInfo(form)}
          isLoading={createRoom.isPending}
          onClick={submit}
        />
      )}

      {isExitConfirmOpen && (
        <ConfirmModal onConfirm={exit} onClose={() => setIsExitConfirmOpen(false)}>
          {ROOM_CREATE_EXIT_MESSAGE}
        </ConfirmModal>
      )}
    </main>
  );
}
