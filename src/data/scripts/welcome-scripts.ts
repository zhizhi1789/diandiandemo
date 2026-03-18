import type { ChatScript } from '@/types';

/**
 * 健身教练欢迎脚本
 * 入口：自动发送欢迎消息 → 等待用户输入目标
 */
export const fitnessCoachWelcomeScript: ChatScript = {
  id: 'fitness-welcome',
  flowName: '健身教练欢迎',
  agentId: 'fitness-coach',
  entryNodeId: 'fw-1',
  nodes: [
    {
      id: 'fw-1',
      trigger: { type: 'auto', delayMs: 800 },
      messages: [
        {
          id: 'fw-1-m1',
          role: 'ai',
          contentType: 'text',
          text: '嗨！我是你的AI健身教练 💪 很高兴认识你！在开始之前，我想先了解一下你的基本情况，这样才能为你制定最合适的训练计划。',
          timestamp: 0,
          agentId: 'fitness-coach',
        },
        {
          id: 'fw-1-m2',
          role: 'ai',
          contentType: 'text',
          text: '能告诉我你的健身目标是什么吗？比如增肌、减脂、塑形、还是提升体能？',
          timestamp: 0,
          agentId: 'fitness-coach',
        },
      ],
      nextNodeId: 'fw-2',
    },
    {
      id: 'fw-2',
      trigger: { type: 'user-input' },
      messages: [],
      // Flow A 的脚本会在这里被接入
      // nextNodeId 将由 Flow A 脚本设置
    },
  ],
};

/**
 * 私人助理欢迎脚本
 */
export const personalAssistantWelcomeScript: ChatScript = {
  id: 'assistant-welcome',
  flowName: '私人助理欢迎',
  agentId: 'personal-assistant',
  entryNodeId: 'aw-1',
  nodes: [
    {
      id: 'aw-1',
      trigger: { type: 'auto', delayMs: 800 },
      messages: [
        {
          id: 'aw-1-m1',
          role: 'ai',
          contentType: 'text',
          text: '你好小林！我是你的私人助理 ✨ 可以帮你管理日程、整理信息、处理各种日常事务。',
          timestamp: 0,
          agentId: 'personal-assistant',
        },
        {
          id: 'aw-1-m2',
          role: 'ai',
          contentType: 'text',
          text: '有什么可以帮你的吗？',
          timestamp: 0,
          agentId: 'personal-assistant',
        },
      ],
      nextNodeId: 'aw-2',
    },
    {
      id: 'aw-2',
      trigger: { type: 'user-input' },
      messages: [],
      // Flow E 的脚本会在这里被接入
    },
  ],
};

/**
 * 营养师欢迎脚本（仅展示欢迎消息，不编排对话 Flow）
 */
export const nutritionistWelcomeScript: ChatScript = {
  id: 'nutritionist-welcome',
  flowName: '营养师欢迎',
  agentId: 'nutritionist',
  entryNodeId: 'nw-1',
  nodes: [
    {
      id: 'nw-1',
      trigger: { type: 'auto', delayMs: 800 },
      messages: [
        {
          id: 'nw-1-m1',
          role: 'ai',
          contentType: 'text',
          text: '你好小林！我是你的营养师 🥗 可以帮你制定饮食方案、分析营养摄入、提供健康饮食建议。',
          timestamp: 0,
          agentId: 'nutritionist',
        },
        {
          id: 'nw-1-m2',
          role: 'ai',
          contentType: 'text',
          text: '来聊聊你的饮食计划吧，告诉我你的饮食习惯和目标~',
          timestamp: 0,
          agentId: 'nutritionist',
        },
      ],
      // 营养师没有后续 Flow，到这里结束
    },
  ],
};

/** 根据 agentId 获取欢迎脚本 */
export function getWelcomeScript(agentId: string): ChatScript | null {
  switch (agentId) {
    case 'fitness-coach':
      return fitnessCoachWelcomeScript;
    case 'personal-assistant':
      return personalAssistantWelcomeScript;
    case 'nutritionist':
      return nutritionistWelcomeScript;
    default:
      return null;
  }
}
