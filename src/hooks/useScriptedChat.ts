import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, ChatScript, ScriptNode } from '@/types';
import { useDemoStore } from '@/store/demoStore';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 脚本化对话引擎 Hook
 *
 * 按预编排的 ChatScript 驱动对话流：
 * - 自动推进 auto 节点（带打字延迟）
 * - 响应用户输入 / 按钮点击 / 选项选择
 * - 执行节点副作用（写入 Zustand store）
 * - 支持条件分支（nextNodeId 可为函数）
 */
export function useScriptedChat(script: ChatScript) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(script.entryNodeId);
  const [isTyping, setIsTyping] = useState(false);
  const executingRef = useRef(false);
  // 用于在卸载后取消后续执行
  const cancelledRef = useRef(false);

  // 每次 startChat 生成新的 sessionId，delay 回调通过比对 sessionId 判断是否过期
  const sessionIdRef = useRef(0);

  // 用 ref 保存 script，确保所有回调都能拿到最新数据
  const scriptRef = useRef(script);
  scriptRef.current = script;

  // 用 ref 保存 currentNodeId，确保回调中拿到最新值
  const currentNodeIdRef = useRef(currentNodeId);
  currentNodeIdRef.current = currentNodeId;

  const findNode = useCallback(
    (nodeId: string): ScriptNode | undefined =>
      scriptRef.current.nodes.find((n) => n.id === nodeId),
    [],
  );

  const resolveNextNodeId = useCallback(
    (node: ScriptNode, context?: Record<string, any>): string | undefined => {
      if (!node.nextNodeId) return undefined;
      if (typeof node.nextNodeId === 'function') {
        return node.nextNodeId(context ?? {});
      }
      return node.nextNodeId;
    },
    [],
  );

  /**
   * 执行指定脚本节点：逐条发送消息 → 执行副作用 → 推进到下一节点
   */
  const executeNode = useCallback(
    async (nodeId: string, context?: Record<string, any>) => {
      if (cancelledRef.current) return;

      const node = findNode(nodeId);
      if (!node) return;

      executingRef.current = true;
      const fastForward = useDemoStore.getState().fastForward;

      // 逐条发送消息，AI 消息带打字延迟
      for (const msg of node.messages) {
        if (cancelledRef.current) break;

        if (msg.role === 'ai') {
          setIsTyping(true);
          const typingDelay = fastForward ? 100 : 800 + Math.random() * 1200;
          await delay(typingDelay);
          if (cancelledRef.current) break;
          setIsTyping(false);
        }

        setMessages((prev) => [...prev, { ...msg, timestamp: Date.now() }]);
      }

      setIsTyping(false);

      // 执行副作用
      if (!cancelledRef.current) {
        node.sideEffects?.();
      }

      // 推进到下一节点
      const nextId = resolveNextNodeId(node, context);
      if (nextId && !cancelledRef.current) {
        const nextNode = findNode(nextId);
        if (nextNode?.trigger.type === 'auto') {
          // auto 节点：延迟后自动执行
          const autoDelay = fastForward ? 50 : nextNode.trigger.delayMs;
          await delay(autoDelay);
          await executeNode(nextId, context);
          return; // 递归结束后直接返回
        } else {
          // 非 auto 节点：等待用户操作
          setCurrentNodeId(nextId);
        }
      }

      executingRef.current = false;
    },
    [findNode, resolveNextNodeId],
  );

  /**
   * 用户发送消息 → 追加到消息列表 → 匹配当前节点 → 执行
   */
  const sendUserMessage = useCallback(
    (text: string) => {
      const nodeId = currentNodeIdRef.current;
      if (!nodeId || executingRef.current) return;

      const node = findNode(nodeId);
      if (!node) return;

      // 验证触发条件
      if (node.trigger.type === 'user-input') {
      if (node.trigger.matchText && node.trigger.matchText !== text) {
        // matchText 不匹配，仍然追加用户消息但不推进
      }

      // 追加用户消息
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        contentType: 'text',
        text,
        timestamp: Date.now(),
        agentId: scriptRef.current.agentId,
      };
      setMessages((prev) => [...prev, userMsg]);

      // 立即清除当前节点，避免预填充文本残留在输入框
      setCurrentNodeId(null);

      // 执行当前节点（节点的 messages 通常是 AI 回复）
      executeNode(nodeId);
    }
    },
    [findNode, executeNode],
  );

  /**
   * 按钮点击 / 选项选择 → 匹配当前节点 → 执行
   *
   * 匹配逻辑：
   * - 如果 trigger 中指定了精确的 buttonId / optionId，则严格匹配
   * - 如果 trigger 仅指定了类型（如 option-select 不带 optionId），则只要 actionType 匹配即执行
   * - 支持通过 context 传递用户选择信息
   */
  const handleAction = useCallback(
    (actionType: 'button-click' | 'option-select', actionId: string) => {
      const nodeId = currentNodeIdRef.current;
      if (!nodeId || executingRef.current) return;

      const node = findNode(nodeId);
      if (!node) return;

      const trigger = node.trigger;
      let matched = false;

      if (trigger.type === 'button-click' && actionType === 'button-click') {
        matched = !trigger.buttonId || trigger.buttonId === actionId;
      } else if (trigger.type === 'option-select' && actionType === 'option-select') {
        matched = !trigger.optionId || trigger.optionId === actionId;
      }

      if (matched) {
        executeNode(nodeId, { actionId });
      }
    },
    [findNode, executeNode],
  );

  /**
   * 启动对话：执行入口节点
   * 由 AgentDetailPage 在 mount 时调用
   *
   * 使用 sessionId 机制处理 React StrictMode 双重挂载：
   * 每次调用 startChat 递增 sessionId，delay 回调通过比对 sessionId 判断是否已过期
   */
  const startChat = useCallback(() => {
    // 生成新的 session，使旧 session 的 delay 回调失效
    const currentSession = ++sessionIdRef.current;

    cancelledRef.current = false;
    executingRef.current = false;
    setMessages([]);
    setIsTyping(false);
    setCurrentNodeId(scriptRef.current.entryNodeId);

    const entryNode = findNode(scriptRef.current.entryNodeId);
    if (entryNode?.trigger.type === 'auto') {
      const fastForward = useDemoStore.getState().fastForward;
      const d = fastForward ? 50 : entryNode.trigger.delayMs;
      delay(d).then(() => {
        // 只有当前 session 仍然有效时才执行
        if (!cancelledRef.current && sessionIdRef.current === currentSession) {
          executeNode(scriptRef.current.entryNodeId);
        }
      });
    }
  }, [findNode, executeNode]);

  /**
   * 停止执行（用于组件卸载清理）
   */
  const stopChat = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  /**
   * 追加一个脚本到当前对话（用于 Flow 串联：A → B → C）
   */
  const appendScript = useCallback(
    (newScript: ChatScript) => {
      setCurrentNodeId(newScript.entryNodeId);
      const entryNode = newScript.nodes.find((n) => n.id === newScript.entryNodeId);
      if (entryNode?.trigger.type === 'auto') {
        const fastForward = useDemoStore.getState().fastForward;
        const d = fastForward ? 50 : entryNode.trigger.delayMs;
        delay(d).then(() => executeNode(newScript.entryNodeId));
      }
    },
    [executeNode],
  );

  return {
    messages,
    isTyping,
    currentNodeId,
    sendUserMessage,
    handleAction,
    executeNode,
    startChat,
    stopChat,
    appendScript,
    setMessages,
  };
}
