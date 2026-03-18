import type { ChatScript, ScriptNode } from '@/types';
import { flightInfo } from '@/data/flight-info';
import { useNotificationStore } from '@/store/notificationStore';
import { personalAssistantWelcomeScript } from './welcome-scripts';

/**
 * Flow E：跨 Agent 协同 — 私人助理对话
 *
 * 节点编排：
 * aw-2(用户输入机票需求) → E1(创建观察任务) → E2(FlightSearchCard) → E3(确认购买) → E4(冲突通知)
 */
export const flowENodes: ScriptNode[] = [
  // E1: AI 回复创建价格观察任务
  {
    id: 'E1',
    trigger: { type: 'auto', delayMs: 1500 },
    messages: [
      {
        id: 'E1-m1',
        role: 'ai',
        contentType: 'text',
        text: '好的！我帮你创建一个价格观察任务，搜索 5-6 月周末上海到东京的机票，价格 ≤2000 元。',
        timestamp: 0,
        agentId: 'personal-assistant',
      },
      {
        id: 'E1-m2',
        role: 'ai',
        contentType: 'text',
        text: '正在搜索中... 找到了一个不错的选择 ✈️',
        timestamp: 0,
        agentId: 'personal-assistant',
      },
    ],
    nextNodeId: 'E2',
  },

  // E2: 展示 FlightSearchCard
  {
    id: 'E2',
    trigger: { type: 'auto', delayMs: 2000 },
    messages: [
      {
        id: 'E2-m1',
        role: 'ai',
        contentType: 'flight-search',
        text: '',
        cardData: { flight: flightInfo },
        timestamp: 0,
        agentId: 'personal-assistant',
      },
    ],
    nextNodeId: 'E3',
  },

  // E3: 等待用户选择（确认购买 / 继续观察）
  {
    id: 'E3',
    trigger: { type: 'option-select' },
    messages: [
      {
        id: 'E3-m1',
        role: 'ai',
        contentType: 'text',
        text: '好的，已帮你锁定这个价格！东京之旅值得期待 🗼',
        timestamp: 0,
        agentId: 'personal-assistant',
      },
      {
        id: 'E3-m2',
        role: 'ai',
        contentType: 'text',
        text: '不过我注意到 5/16（周六）你有一个训练计划安排。让我帮你协调一下... 📅',
        timestamp: 0,
        agentId: 'personal-assistant',
      },
    ],
    nextNodeId: 'E4',
  },

  // E4: 自动推送冲突通知
  {
    id: 'E4',
    trigger: { type: 'auto', delayMs: 1500 },
    messages: [
      {
        id: 'E4-m1',
        role: 'ai',
        contentType: 'text',
        text: '我已经通知了你的健身教练关于行程冲突的事。你可以在通知页查看并确认调整方案 👆',
        timestamp: 0,
        agentId: 'personal-assistant',
      },
    ],
    sideEffects: () => {
      // 推送冲突通知到通知页
      useNotificationStore.getState().addNotification({
        id: `notify-conflict-${Date.now()}`,
        agentId: 'personal-assistant',
        agentName: 'AI 私人助理',
        title: '行程冲突提醒',
        reason: '发现你的东京出行（5/16-17）与周六训练计划冲突',
        suggestion: '建议取消本次训练或调整到其他时间，确保旅行不受影响。',
        confirmText: '需要你确认：调整训练日程',
        actions: [
          { id: 'cancel-training', label: '取消本次训练', primary: true },
          { id: 'reschedule', label: '换个时间' },
        ],
        timestamp: Date.now(),
        read: false,
        handled: false,
      });
    },
  },
];

/**
 * 获取合并了 Flow E 节点的私人助理完整脚本
 * 将欢迎脚本的 aw-2 节点的 nextNodeId 指向 Flow E 入口
 */
export function getPersonalAssistantFullScript(): ChatScript {
  return {
    id: 'personal-assistant-full',
    flowName: '私人助理完整脚本',
    agentId: 'personal-assistant',
    entryNodeId: 'aw-1',
    nodes: [
      // 欢迎节点 aw-1（不变）
      personalAssistantWelcomeScript.nodes[0],
      // aw-2 指向 Flow E 入口
      {
        ...personalAssistantWelcomeScript.nodes[1],
        nextNodeId: 'E1',
      },
      // Flow E 节点
      ...flowENodes,
    ],
  };
}
