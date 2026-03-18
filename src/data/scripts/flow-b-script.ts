import type { ScriptNode } from '@/types';
import { useTrainingStore } from '@/store/trainingStore';

/**
 * Flow B：训练日执行
 *
 * 节点编排：
 * B1(训练前提醒卡) → B2(用户点击"开始训练") → B3(展示今日训练卡) → B4(用户提问) → B5(AI回复+动作建议卡)
 *
 * 串联方式：A5-confirm.nextNodeId → 'B1'
 */
export const flowBNodes: ScriptNode[] = [
  // B1: 训练前提醒（auto 2s，从 A5-confirm 接续）
  {
    id: 'B1',
    trigger: { type: 'auto', delayMs: 2000 },
    messages: [
      {
        id: 'B1-m1',
        role: 'ai',
        contentType: 'text',
        text: '嗨小林！今天是你的第一个训练日，准备好了吗？😊',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
      {
        id: 'B1-m2',
        role: 'ai',
        contentType: 'training-reminder',
        text: '',
        cardData: {
          // 数据在组件中从 trainingStore 读取
        },
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'B2',
  },

  // B2: 等待用户点击"开始训练"按钮
  {
    id: 'B2',
    trigger: { type: 'button-click', buttonId: 'start-training' },
    messages: [
      {
        id: 'B2-m1',
        role: 'ai',
        contentType: 'text',
        text: '太棒了！让我们开始今天的训练吧 💪 这是你今天的训练安排，完成每个动作后可以打勾标记：',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    sideEffects: () => {
      useTrainingStore.getState().startTraining();
    },
    nextNodeId: 'B3',
  },

  // B3: 展示今日训练卡（auto 1s）
  {
    id: 'B3',
    trigger: { type: 'auto', delayMs: 1000 },
    messages: [
      {
        id: 'B3-m1',
        role: 'ai',
        contentType: 'today-training',
        text: '',
        cardData: {
          // 数据在组件中从 trainingStore 读取
        },
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'B4',
  },

  // B4: 等待用户提问
  {
    id: 'B4',
    trigger: { type: 'user-input' },
    messages: [],
    nextNodeId: 'B5',
  },

  // B5: AI 回复动作建议卡（auto 1.5s） → 接续 Flow C
  {
    id: 'B5',
    trigger: { type: 'auto', delayMs: 1500 },
    messages: [
      {
        id: 'B5-m1',
        role: 'ai',
        contentType: 'text',
        text: '卧推是非常经典的上肢训练动作！作为初学者，掌握正确的姿势很重要。这里是我整理的注意事项：',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
      {
        id: 'B5-m2',
        role: 'ai',
        contentType: 'exercise-advice',
        text: '',
        cardData: {
          // 数据在组件中从 xhs-notes 读取
        },
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'C1', // 串联 Flow C
  },
];
