import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import ConnectionStatusBanner from "@/components/training/comprehension/ConnectionStatusBanner";
import ApplicantSheet from "@/components/training/discussion/room/ApplicantSheet";
import InviteCodeModal from "@/components/training/discussion/room/InviteCodeModal";
import RoomChatHeader from "@/components/training/discussion/room/RoomChatHeader";
import RoomMessageList from "@/components/training/discussion/room/RoomMessageList";
import ConfirmDialog from "@/components/training/discussion/shared/ConfirmDialog";
import NoticeModal from "@/components/training/discussion/shared/NoticeModal";
import ChatInput from "@/components/training/shared/chat/ChatInput";
import {
  getKickConfirmMessage,
  getLeaveConfirmMessage,
  ROOM_CHAT_LOAD_ERROR,
  ROOM_END_MESSAGE,
  ROOM_LEFT_TOAST,
} from "@/constants/training/discussion/roomChat";
import { useRoomChat } from "@/hooks/training/discussion/useRoomChat";
import {
  useMarkRoomRead,
  useRoomChatSession,
  useRoomMessages,
} from "@/hooks/training/discussion/useRoomChatQueries";
import {
  useDeleteRoom,
  useKickMember,
  useLeaveRoom,
} from "@/hooks/training/discussion/useRoomMutations";
import { useRoomApplicants, useRoomInviteCode } from "@/hooks/training/discussion/useRoomQueries";
import { useToastStore } from "@/stores/common/toast";
import { useTrainingStore } from "@/stores/training/trainingTab";
import { RoomApiError } from "@/api/training/discussion/room";
import { getRoomErrorMessage } from "@/utils/training/discussion/getRoomErrorMessage";
import { toRoomChatRows } from "@/utils/training/discussion/toRoomChatRows";

import type { RoomMemberTarget } from "@/types/training/discussion/roomChat";

type RoomDialog = { type: "leave" } | { type: "kick"; member: RoomMemberTarget };

export default function DiscussionRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId: roomIdParam } = useParams();

  const roomId = Number(roomIdParam);

  const setActiveTab = useTrainingStore((state) => state.setActiveTab);
  const showToast = useToastStore((state) => state.showToast);

  const sessionQuery = useRoomChatSession(roomId);
  const session = sessionQuery.data;

  const messagesQuery = useRoomMessages(roomId, session !== undefined);

  // 본인 메시지 판별은 서버가 알려준 내 id 기준
  const myUserId = messagesQuery.data?.pages[0]?.myUserId;

  const { status, endReason, sendMessage, retryMessage, retryConnection } = useRoomChat(
    roomId,
    myUserId,
  );

  const leaveRoom = useLeaveRoom();
  const deleteRoom = useDeleteRoom();
  const kickMember = useKickMember();
  const { mutate: markRoomRead } = useMarkRoomRead();

  const isHost = session?.isHost ?? false;

  // 참여 코드는 방장만 조회 가능
  const inviteCodeQuery = useRoomInviteCode(roomId, isHost);
  const inviteCode = inviteCodeQuery.data?.inviteCode ?? null;

  const applicantsQuery = useRoomApplicants(roomId, isHost);

  const [dialog, setDialog] = useState<RoomDialog | null>(null);
  const [isInviteCodeOpen, setIsInviteCodeOpen] = useState(false);
  const [isApplicantOpen, setIsApplicantOpen] = useState(false);

  const messages = useMemo(
    () => messagesQuery.data?.pages.toReversed().flatMap((page) => page.messages),
    [messagesQuery.data],
  );

  const lastReadAt = messagesQuery.data?.pages[0]?.lastReadAt ?? null;

  // 입장 시점에 안 읽은 메시지가 있을 때만 구분선 위치 고정
  const [dividerAfterId, setDividerAfterId] = useState<string | null | undefined>(undefined);

  // 캐시된 옛 읽음 시각으로 굳지 않도록 재조회가 끝난 뒤 확정
  if (dividerAfterId === undefined && session && messages && !messagesQuery.isFetching) {
    const readUntil = lastReadAt ? Date.parse(lastReadAt) : null;
    const lastRead =
      readUntil === null
        ? undefined
        : messages.filter((message) => Date.parse(message.sentAt) <= readUntil).at(-1);

    setDividerAfterId(
      lastRead && lastRead.messageId !== messages.at(-1)?.messageId ? lastRead.messageId : null,
    );
  }

  // 채팅방을 연 시점을 읽음 위치로 저장
  const hasMessages = messages !== undefined;

  useEffect(() => {
    if (hasMessages) markRoomRead(roomId);
  }, [hasMessages, roomId, markRoomRead]);

  const rows = useMemo(
    () =>
      session && messages && myUserId !== undefined
        ? toRoomChatRows(messages, {
            session,
            myUserId,
            dividerAfterId: dividerAfterId ?? null,
          })
        : [],
    [session, messages, myUserId, dividerAfterId],
  );

  const goDiscussionTab = () => {
    setActiveTab("debate");
    navigate("/training", { replace: true });
  };

  // 채팅 화면만 닫기, 앱 안 이동 기록이 없으면 토론장 탭으로
  const goBack = () => (location.key === "default" ? goDiscussionTab() : navigate(-1));

  const confirmDialog = () => {
    if (!dialog) return;

    // 방장은 나가기 대신 방 삭제
    if (dialog.type === "leave") {
      const exitRoom = isHost ? deleteRoom : leaveRoom;

      exitRoom.mutate(roomId, {
        onSuccess: () => {
          showToast(ROOM_LEFT_TOAST);
          goDiscussionTab();
        },
      });
      return;
    }

    kickMember.mutate(
      { roomId, memberId: dialog.member.memberId },
      { onSuccess: () => setDialog(null) },
    );
  };

  const sessionRejection =
    sessionQuery.error instanceof RoomApiError ? getRoomErrorMessage(sessionQuery.error) : null;

  const noticeMessage = endReason ? ROOM_END_MESSAGE[endReason] : sessionRejection;

  const exitMutation = isHost ? deleteRoom : leaveRoom;

  const activeMutation = dialog?.type === "leave" ? exitMutation : kickMember;

  return (
    <main className="flex h-dvh flex-col">
      <RoomChatHeader
        title={session?.roomTitle ?? ""}
        onBack={goBack}
        onLeave={session && !endReason ? () => setDialog({ type: "leave" }) : undefined}
        applicantCount={applicantsQuery.data?.totalCount ?? 0}
        onShowApplicants={isHost ? () => setIsApplicantOpen(true) : undefined}
        onShowInviteCode={inviteCode ? () => setIsInviteCodeOpen(true) : undefined}
      />

      <ConnectionStatusBanner status={status} onRetry={retryConnection} />

      {sessionQuery.isError && !sessionRejection ? (
        <div className="flex-1 px-5 pt-6">
          <SectionState isError onRetry={() => void sessionQuery.refetch()} className="h-40" />
          <p className="sr-only">{ROOM_CHAT_LOAD_ERROR}</p>
        </div>
      ) : (
        <RoomMessageList
          rows={rows}
          hasOlder={messagesQuery.hasNextPage}
          isFetchingOlder={messagesQuery.isFetchingNextPage}
          fetchOlder={messagesQuery.fetchNextPage}
          onRetry={retryMessage}
          onKick={(member) => setDialog({ type: "kick", member })}
        />
      )}

      <ChatInput
        disabled={!messages || endReason !== null || status !== "open"}
        onSend={sendMessage}
      />

      {dialog && session && (
        <ConfirmDialog
          message={
            dialog.type === "leave"
              ? getLeaveConfirmMessage(session.roomTitle, isHost)
              : getKickConfirmMessage(dialog.member.nickname)
          }
          isPending={activeMutation.isPending}
          errorMessage={activeMutation.isError ? getRoomErrorMessage(activeMutation.error) : null}
          onConfirm={confirmDialog}
          onClose={() => setDialog(null)}
        />
      )}

      {isApplicantOpen && (
        <ApplicantSheet roomId={roomId} onClose={() => setIsApplicantOpen(false)} />
      )}

      {isInviteCodeOpen && inviteCode && (
        <InviteCodeModal code={inviteCode} onClose={() => setIsInviteCodeOpen(false)} />
      )}

      {noticeMessage && <NoticeModal message={noticeMessage} onClose={goDiscussionTab} />}
    </main>
  );
}
