import type { ScriptNode } from '@/types';

/**
 * Flow F：第一周训练周报
 *
 * 节点编排：
 * F1(恭喜文案) → F2(周报统计卡片)
 *
 * 串联方式：Flow C 的 C4 结束后 → 通过 D1 触发
 * （D1 在 C4 的 sideEffects 写入通知后延迟触发）
 */
export const flowFNodes: ScriptNode[] = [
  // D1: 模型主动输出恭喜文案（延迟较长，模拟 Flow D 通知处理后的回归）
  {
    id: 'D1',
    trigger: { type: 'auto', delayMs: 5000 },
    messages: [
      {
        id: 'D1-m1',
        role: 'ai',
        contentType: 'text',
        text: '🎉 恭喜，你完成了第一周的计划！',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
      {
        id: 'D1-m2',
        role: 'ai',
        contentType: 'text',
        text: '来看看你这一周的训练成果吧：',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'D2',
  },

  // D2: 展示周报统计卡片（auto 1.5s）
  {
    id: 'D2',
    trigger: { type: 'auto', delayMs: 1500 },
    messages: [
      {
        id: 'D2-m1',
        role: 'ai',
        contentType: 'weekly-stats',
        text: '',
        cardData: {
          totalDuration: 165,
          totalCalories: 834,
          favoriteExercise: '卧推',
          peakHeartRate: 180,
        },
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    // 周报 Flow 结束，无后续节点
  },
];
