import { create } from 'zustand';
import type { ChatMessage } from '@/types';

interface ChatState {
  /** 每个 Agent 的对话消息历史（agentId → messages） */
  messagesByAgent: Record<string, ChatMessage[]>;
  /** 当前活跃的 Flow ID（如 'flow-a'） */
  activeFlowId: string | null;
  /** 当前正在打字的 Agent ID */
  typingAgentId: string | null;

  /** 为指定 Agent 追加消息 */
  addMessage: (agentId: string, message: ChatMessage) => void;
  /** 批量设置消息（用于 useScriptedChat 同步） */
  setMessages: (agentId: string, messages: ChatMessage[]) => void;
  /** 设置活跃 Flow */
  setActiveFlow: (flowId: string | null) => void;
  /** 设置打字状态 */
  setTyping: (agentId: string | null) => void;
  /** 追加系统消息 */
  addSystemMessage: (agentId: string, text: string) => void;
  /** 清空指定 Agent 的消息 */
  clearAgent: (agentId: string) => void;
  /** 重置所有状态 */
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messagesByAgent: {},
  activeFlowId: null,
  typingAgentId: null,

  addMessage: (agentId, message) =>
    set((state) => ({
      messagesByAgent: {
        ...state.messagesByAgent,
        [agentId]: [...(state.messagesByAgent[agentId] ?? []), message],
      },
    })),

  setMessages: (agentId, messages) =>
    set((state) => ({
      messagesByAgent: {
        ...state.messagesByAgent,
        [agentId]: messages,
      },
    })),

  setActiveFlow: (flowId) => set({ activeFlowId: flowId }),

  setTyping: (agentId) => set({ typingAgentId: agentId }),

  addSystemMessage: (agentId, text) =>
    set((state) => ({
      messagesByAgent: {
        ...state.messagesByAgent,
        [agentId]: [
          ...(state.messagesByAgent[agentId] ?? []),
          {
            id: `sys-${Date.now()}`,
            role: 'system' as const,
            contentType: 'text' as const,
            text,
            timestamp: Date.now(),
            agentId,
          },
        ],
      },
    })),

  clearAgent: (agentId) =>
    set((state) => {
      const { [agentId]: _, ...rest } = state.messagesByAgent;
      return { messagesByAgent: rest };
    }),

  reset: () =>
    set({
      messagesByAgent: {},
      activeFlowId: null,
      typingAgentId: null,
    }),
}));
