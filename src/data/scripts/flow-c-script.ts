import type { ScriptNode } from '@/types';
import { useTrainingStore } from '@/store/trainingStore';
import { useNotificationStore } from '@/store/notificationStore';
import { wearableData } from '@/data/wearable-data';

/**
 * Flow C：训练后总结
 *
 * 节点编排：
 * C1(用户点TodayTrainingCard的"完成训练") → C2(数据权限请求卡) → C3(训练总结卡) → C4(写入记录确认)
 *
 * 串联方式：B5 结束后，TodayTrainingCard 的"完成训练"按钮
 *           通过 handleAction('button-click', 'finish-training') 触发 C1
 */
export const flowCNodes: ScriptNode[] = [
  // C1: 等待用户在 TodayTrainingCard 中点击"完成训练"
  {
    id: 'C1',
    trigger: { type: 'button-click', buttonId: 'finish-training' },
    messages: [
      {
        id: 'C1-m1',
        role: 'ai',
        contentType: 'text',
        text: '训练辛苦啦！🎉 在生成总结之前，我需要读取一下你的运动数据。',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'C2',
  },

  // C2: 数据权限请求卡（auto 1s）
  {
    id: 'C2',
    trigger: { type: 'auto', delayMs: 1000 },
    messages: [
      {
        id: 'C2-m1',
        role: 'ai',
        contentType: 'data-permission',
        text: '',
        cardData: {
          description:
            '我可以读取你这次训练的摘要数据，用来更新训练记录。包括时长、平均心率、消耗热量等。是否允许本次读取？',
          options: [
            { id: 'allow-once', label: '允许一次' },
            { id: 'allow-always', label: '始终允许' },
            { id: 'deny', label: '不允许' },
          ],
        },
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'C2-confirm',
  },

  // C2-confirm: 等待用户选择权限选项 → 展示训练总结
  {
    id: 'C2-confirm',
    trigger: { type: 'option-select' },
    messages: [
      {
        id: 'C2-confirm-m1',
        role: 'ai',
        contentType: 'text',
        text: '好的，已成功读取你的运动摘要 📊 这是你本次训练的总结：',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'C3',
  },

  // C3: 训练总结卡（auto 1.5s）
  {
    id: 'C3',
    trigger: { type: 'auto', delayMs: 1500 },
    messages: [
      {
        id: 'C3-m1',
        role: 'ai',
        contentType: 'training-summary',
        text: '',
        cardData: {
          duration: wearableData.totalDuration,
          avgHeartRate: wearableData.avgHeartRate,
          caloriesBurned: wearableData.caloriesBurned,
          maxHeartRate: wearableData.maxHeartRate,
          minHeartRate: wearableData.minHeartRate,
        },
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    nextNodeId: 'C4',
  },

  // C4: 等待用户选择体感反馈 → 写入训练记录
  {
    id: 'C4',
    trigger: { type: 'option-select' },
    messages: [
      {
        id: 'C4-m1',
        role: 'ai',
        contentType: 'text',
        text: '已为你更新训练档案 📝 第一次训练就完成得这么好，继续保持！下次训练我会根据你的反馈做适当调整。',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
      {
        id: 'C4-m2',
        role: 'ai',
        contentType: 'text',
        text: '好好休息，记得补充蛋白质哦～下次训练日见！💪',
        timestamp: 0,
        agentId: 'fitness-coach',
      },
    ],
    sideEffects: () => {
      const { currentPlan, todayProgress } = useTrainingStore.getState();

      // 保存训练记录
      useTrainingStore.getState().saveTrainingRecord({
        date: new Date().toISOString().split('T')[0],
        dayType: currentPlan?.days[0]?.name ?? '力量训练',
        duration: wearableData.totalDuration,
        caloriesBurned: wearableData.caloriesBurned,
        avgHeartRate: wearableData.avgHeartRate,
        maxHeartRate: wearableData.maxHeartRate,
        minHeartRate: wearableData.minHeartRate,
        completedExercises: todayProgress.completedExercises.length,
        totalExercises: currentPlan?.days[0]?.exercises.length ?? 6,
        feedback: useTrainingStore.getState().lastFeedback ?? 'normal',
      });

      // 写入主动建议通知（Flow D 的触发）
      useNotificationStore.getState().addNotification({
        id: `notify-fitness-${Date.now()}`,
        agentId: 'fitness-coach',
        agentName: 'AI 健身教练',
        title: '训练负荷建议',
        reason:
          '我发现你最近 3 次力量训练的整体负荷有点高，恢复压力在上升。',
        suggestion:
          '如果你愿意，我建议加 1 次低强度心肺，帮助恢复和提升耐力。',
        confirmText: '需要你确认：加入健身日程',
        actions: [
          { id: 'accept', label: '接受建议', primary: true },
          { id: 'dismiss', label: '暂不调整' },
        ],
        timestamp: Date.now(),
        read: false,
        handled: false,
      });
    },
  },
];
