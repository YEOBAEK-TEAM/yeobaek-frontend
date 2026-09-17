import { mockChatTransport } from "@/api/training/mockChatTransport";
import { sseChatTransport } from "@/api/training/sseChatTransport";

import type { ChatTransport } from "@/types/training/chatTransport";

// 목 전송과 실제 전송 전환
export const chatTransport: ChatTransport =
  import.meta.env.VITE_USE_MOCK_CHAT === "false" ? sseChatTransport : mockChatTransport;
