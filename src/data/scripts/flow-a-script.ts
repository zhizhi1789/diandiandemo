import type { ChatScript } from '@/types';
import { defaultTrainingPlan } from '@/data/training-plan';
import { useTrainingStore } from '@/store/trainingStore';
import { useCalendarStore } from '@/store/calendarStore';
import type { CalendarEvent } from '@/types';
import { flowBNodes } from './flow-b-script';
import { flowCNodes } from './flow-c-script';

/**
 * Flow A：首次建立训练计划
 *
 * 节点编排：
 * fw-2(用户输入目标) → A2(AI追问时间) → A3(用户回复时间) → A4(输出训练计划卡) → A5(日历确认卡) → A5-confirm(确认结果)
 */
export const flowAScript: ChatScript = {
  id: 'flow-a',
  flowName: '训练计划对话流',
  agentId: 'fitness-coach',
  entryNodeId: 'A2',
  nodes: [
    // A2: AI 追问可训练时间（由 fw-2 用户输入后自动触发）
    {
      id: 'A2',
      trigger: { type: 'auto', delayMs: 1000 },
      messages: [
        {
          id: 'A2-m1',
          role: 'ai',
          contentType: 'text',
          text: '你的目标非常明确，增肌对初学者来说是个很棒的方向！我会帮你制定一个科学且循序渐进的训练计划 💪',
          timestamp: 0,
          agentId: 'fitness-coach',
        },
        {
          id: 'A2-m2',
          role: 'ai',
          contentType: 'text',
          text: '为了把计划变成可执行日程，我还需要知道你通常想在哪几天、什么时间训练？',
          timestamp: 0,
          agentId: 'fitness-coach',
        },
      ],
      nextNodeId: 'A3',
    },

    // A3: 用户回复具体时间
    {
      id: 'A3',
      trigger: { type: 'user-input' },
      messages: [],
      nextNodeId: 'A4',
    },

    // A4: 输出训练计划卡（auto 2s）
    {
      id: 'A4',
      trigger: { type: 'auto', delayMs: 2000 },
      messages: [
        {
          id: 'A4-m1',
          role: 'ai',
          contentType: 'text',
          text: '好的，根据你的目标和时间安排，我为你定制了一份 4 周增肌训练计划：',
          timestamp: 0,
          agentId: 'fitness-coach',
        },
        {
          id: 'A4-m2',
          role: 'ai',
          contentType: 'training-plan',
          text: '',
          cardData: { plan: defaultTrainingPlan },
          timestamp: 0,
          agentId: 'fitness-coach',
        },
      ],
      sideEffects: () => {
        useTrainingStore.getState().createPlan(defaultTrainingPlan);
      },
      nextNodeId: 'A5',
    },

    // A5: 日历确认卡（auto 1.5s）
    {
      id: 'A5',
      trigger: { type: 'auto', delayMs: 1500 },
      messages: [
        {
          id: 'A5-m1',
          role: 'ai',
          contentType: 'calendar-confirm',
          text: '',
          cardData: {
            description: '我已经把训练时间整理成每周重复的计划。要不要先预览，再加入你的日历？',
            options: [
              { id: 'preview', label: '预览日历' },
              { id: 'save-only', label: '仅保存计划' },
              { id: 'add-4-weeks', label: '加入未来 4 周' },
              { id: 'add-8-weeks', label: '加入未来 8 周' },
            ],
          },
          timestamp: 0,
          agentId: 'fitness-coach',
        },
      ],
      nextNodeId: 'A5-confirm',
    },

    // A5-confirm: 等待用户选择任意日历选项 → 接续 Flow B
    {
      id: 'A5-confirm',
      trigger: { type: 'option-select' }, // 匹配任意选项点击
      messages: [
        {
          id: 'A5-confirm-m1',
          role: 'ai',
          contentType: 'text',
          text: '已经帮你把未来 4 周的训练计划加入日历啦 📅 每周二、周四早上 9 点和周六下午 4 点会有训练提醒。',
          timestamp: 0,
          agentId: 'fitness-coach',
        },
        {
          id: 'A5-confirm-m2',
          role: 'ai',
          contentType: 'text',
          text: '第一次训练就在下个周二，到时候我会提前提醒你做好准备。加油！🔥',
          timestamp: 0,
          agentId: 'fitness-coach',
        },
      ],
      sideEffects: () => {
        // 生成未来 4 周的日历事件
        const events = generate4WeekEvents();
        useCalendarStore.getState().addEvents(events);
      },
      nextNodeId: 'B1', // 串联 Flow B
    },
  ],
};

/** 根据训练计划生成未来 4 周的日历事件 */
function generate4WeekEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const plan = defaultTrainingPlan;
  const now = new Date();

  // 找到下一个匹配的星期几
  const dayMap: Record<string, number> = {
    '周日': 0, '周一': 1, '周二': 2, '周三': 3,
    '周四': 4, '周五': 5, '周六': 6,
  };

  for (let week = 0; week < 4; week++) {
    for (const day of plan.days) {
      const targetDow = dayMap[day.dayOfWeek];
      if (targetDow === undefined) continue;

      // 计算日期
      const currentDow = now.getDay();
      let daysUntil = targetDow - currentDow;
      if (daysUntil <= 0) daysUntil += 7;
      daysUntil += week * 7;

      const eventDate = new Date(now);
      eventDate.setDate(now.getDate() + daysUntil);
      const dateStr = eventDate.toISOString().split('T')[0];

      events.push({
        id: `training-${dateStr}-${day.id}`,
        date: dateStr,
        time: day.time,
        title: `${day.name} · ${day.durationMinutes}分钟`,
        type: 'training',
        agentId: 'fitness-coach',
      });
    }
  }

  return events;
}

/**
 * 获取合并了 Flow A 节点的健身教练完整脚本
 * 将欢迎脚本的 fw-2 节点的 nextNodeId 指向 Flow A 入口
 */
export function getFitnessCoachFullScript(): ChatScript {
  return {
    id: 'fitness-coach-full',
    flowName: '健身教练完整脚本',
    agentId: 'fitness-coach',
    entryNodeId: 'fw-1',
    nodes: [
      // 欢迎脚本节点
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
        nextNodeId: 'A2', // 指向 Flow A 入口
      },
      // Flow A 节点
      ...flowAScript.nodes,
      // Flow B 节点
      ...flowBNodes,
      // Flow C 节点
      ...flowCNodes,
    ],
  };
}
