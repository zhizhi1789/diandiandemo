import type { Agent } from '@/types';

export const agents: Agent[] = [
  {
    id: 'personal-assistant',
    name: '私人助理-cc',
    description: '帮你管理日程、整理信息、处理日常事务',
    lastMessage: '有什么可以帮你的吗？',
    colorFrom: '#7EDBCE',
    colorTo: '#4FCFBC',
    icon: '助',
    avatar: '/avatars/personal-assistant.png',
  },
  {
    id: 'fitness-coach',
    name: '健身教练-小石',
    description: '定制训练计划、指导动作、追踪训练进度',
    lastMessage: '准备好开始今天的训练了吗？💪',
    colorFrom: '#FFB088',
    colorTo: '#FF8C6B',
    icon: '健',
    avatar: '/avatars/fitness-coach.png',
  },
  {
    id: 'nutritionist',
    name: '营养师-方方',
    description: '制定饮食方案、分析营养摄入、健康饮食建议',
    lastMessage: '来聊聊你的饮食计划吧 🥗',
    colorFrom: '#9DD1F5',
    colorTo: '#7CB9E8',
    icon: '营',
    avatar: '/avatars/nutritionist.png',
  },
];

export const getAgent = (id: string) => agents.find((a) => a.id === id);
