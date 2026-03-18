import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { ChatMessage, ChatScript } from '@/types';
import NavBar from '@/components/NavBar';
import InputBar from '@/components/InputBar';
import { getAgent } from '@/data/agents';
import { getWelcomeScript } from '@/data/scripts/welcome-scripts';
import { getFitnessCoachFullScript } from '@/data/scripts/flow-a-script';
import { getPersonalAssistantFullScript } from '@/data/scripts/flow-e-script';
import { useScriptedChat } from '@/hooks/useScriptedChat';
import TrainingPlanCard from '@/features/flow-a/TrainingPlanCard';
import CalendarConfirmCard from '@/features/flow-a/CalendarConfirmCard';
import SkillRecommendCard from '@/features/flow-a/SkillRecommendCard';
import TrainingReminderCard from '@/features/flow-b/TrainingReminderCard';
import TodayTrainingCard from '@/features/flow-b/TodayTrainingCard';
import ExerciseAdviceCard from '@/features/flow-b/ExerciseAdviceCard';
import DataPermissionCard from '@/features/flow-c/DataPermissionCard';
import TrainingSummaryCard from '@/features/flow-c/TrainingSummaryCard';
import FlightSearchCard from '@/features/flow-e/FlightSearchCard';
import WeeklyStatsCard from '@/features/flow-f/WeeklyStatsCard';
import ChatFlow from './ChatFlow';
import styles from './AgentDetailPage.module.css';

/**
 * 根据 agentId 获取完整脚本
 * 健身教练使用合并了 Flow A+B+C 的完整脚本
 * 私人助理使用合并了 Flow E 的完整脚本
 */
function getFullScript(agentId: string): ChatScript | null {
  if (agentId === 'fitness-coach') {
    return getFitnessCoachFullScript();
  }
  if (agentId === 'personal-assistant') {
    return getPersonalAssistantFullScript();
  }
  return getWelcomeScript(agentId);
}

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const agent = getAgent(agentId || '');
  const script = getFullScript(agentId || '');

  const {
    messages,
    isTyping,
    currentNodeId,
    sendUserMessage,
    handleAction,
    startChat,
    stopChat,
    setMessages,
  } = useScriptedChat(
    script ?? {
      id: 'empty',
      flowName: '',
      agentId: agentId || '',
      nodes: [],
      entryNodeId: '',
    },
  );

  // 进入页面时启动对话（仅在 agentId 变化时触发）
  useEffect(() => {
    if (script) {
      startChat();
    }
    return () => stopChat();
    // startChat/stopChat 引用已通过 ref 稳定化，这里只需依赖 agentId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  // 确定当前节点期望的预填充文本
  const prefilledText = getPrefilledText(currentNodeId, script);

  // 结构化卡片渲染回调
  const renderCard = useCallback(
    (message: ChatMessage) => {
      switch (message.contentType) {
        case 'training-plan': {
          const plan = message.cardData?.plan;
          if (!plan) return null;
          return <TrainingPlanCard plan={plan} />;
        }

        case 'calendar-confirm': {
          const { description, options } = message.cardData ?? {};
          if (!description || !options) return null;
          return (
            <CalendarConfirmCard
              description={description}
              options={options}
              onSelect={(optionId) => {
                handleAction('option-select', optionId);
              }}
            />
          );
        }

        case 'skill-recommend': {
          const { recommendation, skillDescription, usageLabel } = message.cardData ?? {};
          if (!recommendation || !skillDescription) return null;
          return (
            <SkillRecommendCard
              recommendation={recommendation}
              skillDescription={skillDescription}
              usageLabel={usageLabel}
              onSelect={(optionId) => {
                handleAction('option-select', optionId);
              }}
            />
          );
        }

        case 'training-reminder': {
          return (
            <TrainingReminderCard
              onStartTraining={() => handleAction('button-click', 'start-training')}
            />
          );
        }

        case 'today-training': {
          return (
            <TodayTrainingCard
              onFinishTraining={() => handleAction('button-click', 'finish-training')}
            />
          );
        }

        case 'exercise-advice': {
          return (
            <ExerciseAdviceCard
              onUploadPhoto={() => {
                const imageMsg: ChatMessage = {
                  id: `user-photo-${Date.now()}`,
                  role: 'user',
                  contentType: 'image',
                  text: '卧推动作截图',
                  cardData: { imageUrl: '/images/bench-press.jpg' },
                  timestamp: Date.now(),
                  agentId: 'fitness-coach',
                };
                setMessages((prev) => [...prev, imageMsg]);
              }}
            />
          );
        }

        case 'data-permission': {
          const { description, options } = message.cardData ?? {};
          if (!description || !options) return null;
          return (
            <DataPermissionCard
              description={description}
              options={options}
              onSelect={(optionId) => {
                handleAction('option-select', optionId);
              }}
            />
          );
        }

        case 'training-summary': {
          const { duration, avgHeartRate, caloriesBurned, maxHeartRate, minHeartRate } =
            message.cardData ?? {};
          return (
            <TrainingSummaryCard
              duration={duration ?? 0}
              avgHeartRate={avgHeartRate ?? 0}
              caloriesBurned={caloriesBurned ?? 0}
              maxHeartRate={maxHeartRate ?? 0}
              minHeartRate={minHeartRate ?? 0}
              onFeedbackSelect={(feedback) => {
                handleAction('option-select', feedback);
              }}
            />
          );
        }

        case 'weekly-stats': {
          const { totalDuration, totalCalories, favoriteExercise, peakHeartRate } =
            message.cardData ?? {};
          return (
            <WeeklyStatsCard
              totalDuration={totalDuration ?? 0}
              totalCalories={totalCalories ?? 0}
              favoriteExercise={favoriteExercise ?? ''}
              peakHeartRate={peakHeartRate ?? 0}
            />
          );
        }

        case 'flight-search': {
          const flight = message.cardData?.flight;
          if (!flight) return null;
          return (
            <FlightSearchCard
              flight={flight}
              onSelect={(optionId) => handleAction('option-select', optionId)}
            />
          );
        }

        default:
          return null;
      }
    },
    [handleAction, setMessages],
  );

  return (
    <div className={styles.page}>
      <NavBar title={agent?.name || 'Agent'} showBack />
      <div className={styles.content}>
        <ChatFlow messages={messages} isTyping={isTyping} renderCard={renderCard} />
      </div>
      <InputBar
        prefilledText={prefilledText}
        onSend={sendUserMessage}
        disabled={isTyping}
        placeholder="输入消息..."
      />
    </div>
  );
}

/**
 * 根据当前节点获取预填充文本
 * Demo 模式下，用户的发言内容是预设的
 */
function getPrefilledText(
  currentNodeId: string | null,
  script: ChatScript | null,
): string | undefined {
  if (!currentNodeId || !script) return undefined;

  const node = script.nodes.find((n) => n.id === currentNodeId);
  if (!node || node.trigger.type !== 'user-input') return undefined;

  // 返回 matchText 作为预填充文本
  if (node.trigger.type === 'user-input' && node.trigger.matchText) {
    return node.trigger.matchText;
  }

  // 对于没有 matchText 的 user-input 节点，根据 agentId + nodeId 返回预设文本
  return getDefaultPrefilledText(script.agentId, currentNodeId);
}

function getDefaultPrefilledText(agentId: string, nodeId: string): string | undefined {
  const prefilledMap: Record<string, Record<string, string>> = {
    'fitness-coach': {
      'fw-2':
        '我是一个完全的初学者，女性，27岁，身高163厘米，体重48公斤。我的主要健身目标是增肌。我每周可以训练3到4次，每次训练时长为45到60分钟。我更喜欢在健身房锻炼。',
      'A3': '周二、周四早上 9-10 点，周六下午 4-5 点',
      'B4': '卧推有什么注意事项？',
    },
    'personal-assistant': {
      'aw-2':
        '我想在5-6月周末去一次东京，找一下2000以下的机票',
    },
  };

  return prefilledMap[agentId]?.[nodeId];
}
