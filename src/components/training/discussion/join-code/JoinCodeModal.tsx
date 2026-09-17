import { ArrowRight, LoaderCircle } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import DiscussionModal from "@/components/training/discussion/shared/DiscussionModal";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";
import { JOIN_CODE } from "@/constants/training/discussion/room";
import { useJoinByCode } from "@/hooks/training/discussion/useRoomMutations";
import { getRoomErrorMessage } from "@/utils/training/discussion/getRoomErrorMessage";
import { normalizeInviteCode } from "@/utils/training/discussion/roomForm";

type JoinCodeModalProps = {
  initialCode?: string;
  onClose: () => void;
};

const SHAKE_KEYFRAMES: Keyframe[] = [
  { transform: "translateX(0)" },
  { transform: "translateX(-6px)" },
  { transform: "translateX(6px)" },
  { transform: "translateX(-3px)" },
  { transform: "translateX(0)" },
];

export default function JoinCodeModal({ initialCode = "", onClose }: JoinCodeModalProps) {
  const fieldId = useId();
  const navigate = useNavigate();

  const fieldRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState(() => normalizeInviteCode(initialCode));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const joinByCode = useJoinByCode();

  // 잘못된 코드 입력 시 가벼운 흔들림 피드백
  const shakeField = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    fieldRef.current?.animate(SHAKE_KEYFRAMES, { duration: 320, easing: "ease-out" });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code || joinByCode.isPending) return;

    joinByCode.mutate(code, {
      onSuccess: ({ roomId }) => {
        onClose();
        navigate(DISCUSSION_PATH.room(roomId));
      },
      onError: (error) => {
        setErrorMessage(getRoomErrorMessage(error));
        shakeField();
      },
    });
  };

  return (
    <DiscussionModal
      labelledBy={`${fieldId}-label`}
      onClose={onClose}
      placement="upper"
      className="max-w-68 rounded-[18px] bg-[#FBFBFB]"
    >
      <form onSubmit={submit} className="px-5.5 pt-5 pb-4">
        <label id={`${fieldId}-label`} htmlFor={fieldId} className="sr-only">
          {JOIN_CODE.label}
        </label>

        <div ref={fieldRef} className="flex items-center gap-2">
          <span aria-hidden="true" className="text-[34px] leading-none font-bold text-[#2C2A2B]">
            #
          </span>

          <input
            id={fieldId}
            value={code}
            onChange={(event) => {
              setCode(normalizeInviteCode(event.target.value));
              setErrorMessage(null);
            }}
            placeholder={JOIN_CODE.placeholder}
            aria-invalid={errorMessage !== null}
            aria-describedby={`${fieldId}-error`}
            autoFocus
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            enterKeyHint="go"
            className={`h-11 min-w-0 flex-1 border-b-2 bg-transparent px-1 text-[26px] tracking-[0.04em] text-[#2C2A2B] uppercase outline-none placeholder:text-[#9A9A9A] ${
              errorMessage ? "border-[#D91414]" : "border-[#2C2A2B]"
            }`}
          />

          <button
            type="submit"
            aria-label={JOIN_CODE.submitLabel}
            disabled={!code || joinByCode.isPending}
            aria-busy={joinByCode.isPending}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAEAE4] text-[#2C2A2B] disabled:text-[#B5B3AC]"
          >
            {joinByCode.isPending ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin motion-reduce:animate-none"
              />
            ) : (
              <ArrowRight aria-hidden="true" strokeWidth={2.5} className="h-4 w-4" />
            )}
          </button>
        </div>

        <p
          id={`${fieldId}-error`}
          role="alert"
          className="min-h-5 pt-1.5 pl-8 text-[13px] text-[#D91414]"
        >
          {errorMessage}
        </p>
      </form>
    </DiscussionModal>
  );
}
