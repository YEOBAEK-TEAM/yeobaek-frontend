import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import ConnectionStatusBanner from "@/components/training/comprehension/ConnectionStatusBanner";
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
} from "@/constants/training/discussion/roomChat";
import { useRoomChat } from "@/hooks/training/discussion/useRoomChat";
import {
  useKickMember,
  useLeaveRoom,
  useRoomChatSession,
  useRoomMessages,
} from "@/hooks/training/discussion/useRoomChatQueries";
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

  const sessionQuery = useRoomChatSession(roomId);
  const session = sessionQuery.data;

  const messagesQuery = useRoomMessages(roomId, session !== undefined);
  const { status, endReason, sendMessage, retryMessage, retryConnection } = useRoomChat(
    roomId,
    session,
  );

  const leaveRoom = useLeaveRoom();
  const kickMember = useKickMember();

  const [dialog, setDialog] = useState<RoomDialog | null>(null);
  const [isInviteCodeOpen, setIsInviteCodeOpen] = useState(false);

  const messages = useMemo(
    () => messagesQuery.data?.pages.toReversed().flatMap((page) => page.messages),
    [messagesQuery.data],
  );

  // 입장 시점에 안 읽은 메시지가 있을 때만 구분선 위치 고정
  const [dividerAfterId, setDividerAfterId] = useState<string | null | undefined>(undefined);

  if (dividerAfterId === undefined && session && messages) {
    const lastReadId = session.lastReadMessageId;
    setDividerAfterId(lastReadId && messages.at(-1)?.messageId !== lastReadId ? lastReadId : null);
  }

  const rows = useMemo(
    () =>
      session && messages
        ? toRoomChatRows(messages, { session, dividerAfterId: dividerAfterId ?? null })
        : [],
    [session, messages, dividerAfterId],
  );

  const isHost = session !== undefined && session.myUserId === session.hostId;

  const goDiscussionTab = () => {
    setActiveTab("debate");
    navigate("/training", { replace: true });
  };

  // 채팅 화면만 닫기, 앱 안 이동 기록이 없으면 토론장 탭으로
  const goBack = () => (location.key === "default" ? goDiscussionTab() : navigate(-1));

  const confirmDialog = () => {
    if (!dialog) return;

    if (dialog.type === "leave") {
      leaveRoom.mutate(roomId, { onSuccess: goDiscussionTab });
      return;
    }

    kickMember.mutate({ roomId, member: dialog.member }, { onSuccess: () => setDialog(null) });
  };

  const sessionRejection =
    sessionQuery.error instanceof RoomApiError ? getRoomErrorMessage(sessionQuery.error) : null;

  const noticeMessage = endReason ? ROOM_END_MESSAGE[endReason] : sessionRejection;

  const activeMutation = dialog?.type === "leave" ? leaveRoom : kickMember;

  return (
    <main className="flex h-dvh flex-col">
      <RoomChatHeader
        title={session?.roomTitle ?? ""}
        onBack={goBack}
        onLeave={session && !endReason ? () => setDialog({ type: "leave" }) : undefined}
        onShowInviteCode={
          isHost && session.inviteCode ? () => setIsInviteCodeOpen(true) : undefined
        }
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

      <ChatInput disabled={!messages || endReason !== null} onSend={sendMessage} />

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

      {isInviteCodeOpen && session?.inviteCode && (
        <InviteCodeModal code={session.inviteCode} onClose={() => setIsInviteCodeOpen(false)} />
      )}

      {noticeMessage && <NoticeModal message={noticeMessage} onClose={goDiscussionTab} />}
    </main>
  );
}
