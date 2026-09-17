import { LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";

import MemberMessage from "@/components/training/discussion/room/MemberMessage";
import MyMessage from "@/components/training/discussion/room/MyMessage";
import NoticeMessage from "@/components/training/discussion/room/NoticeMessage";
import UnreadDivider from "@/components/training/discussion/room/UnreadDivider";
import { useChatScroll } from "@/hooks/training/discussion/useChatScroll";

import type { RoomChatRow, RoomMemberTarget } from "@/types/training/discussion/roomChat";

type RoomMessageListProps = {
  rows: RoomChatRow[];
  hasOlder: boolean;
  isFetchingOlder: boolean;
  fetchOlder: () => unknown;
  onRetry: (clientMessageId: string, text: string) => void;
  onKick: (member: RoomMemberTarget) => void;
};

export default function RoomMessageList({
  rows,
  hasOlder,
  isFetchingOlder,
  fetchOlder,
  onRetry,
  onKick,
}: RoomMessageListProps) {
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const lastRow = rows.at(-1);

  const { containerRef, dividerRef, handleScroll } = useChatScroll({
    firstRowId: rows[0]?.id ?? null,
    lastRowId: lastRow?.id ?? null,
    isLastRowMine: lastRow?.kind === "mine",
    hasOlder,
    isFetchingOlder,
    fetchOlder,
  });

  const closeMenu = useCallback(() => setMenuRowId(null), []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pt-8 pb-4"
    >
      {isFetchingOlder && (
        <LoaderCircle
          aria-label="이전 메시지 불러오는 중"
          className="mx-auto h-5 w-5 shrink-0 animate-spin text-[#A89F94] motion-reduce:animate-none"
        />
      )}

      {rows.map((row) => {
        if (row.kind === "notice") return <NoticeMessage key={row.id} text={row.text} />;

        if (row.kind === "divider") return <UnreadDivider key={row.id} ref={dividerRef} />;

        if (row.kind === "mine") {
          return (
            <MyMessage
              key={row.id}
              text={row.text}
              status={row.status}
              onRetry={() => onRetry(row.clientMessageId, row.text)}
            />
          );
        }

        return (
          <MemberMessage
            key={row.id}
            row={row}
            isMenuOpen={menuRowId === row.id}
            onOpenMenu={() => setMenuRowId(row.id)}
            onCloseMenu={closeMenu}
            onKick={() => {
              closeMenu();
              onKick({ memberId: row.memberId, nickname: row.nickname });
            }}
          />
        );
      })}
    </div>
  );
}
