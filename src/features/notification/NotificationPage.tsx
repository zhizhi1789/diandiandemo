import { useCallback } from 'react';
import NavBar from '@/components/NavBar';
import BottomTabBar from '@/components/BottomTabBar';
import NotificationCard from '@/components/NotificationCard';
import { useNotificationStore } from '@/store/notificationStore';
import { useCalendarStore } from '@/store/calendarStore';
import { useTrainingStore } from '@/store/trainingStore';
import styles from './NotificationPage.module.css';

export default function NotificationPage() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markHandled = useNotificationStore((s) => s.handleAction);

  /**
   * 增强版通知操作回调
   * 根据通知来源 Agent + 操作 ID 分发业务副作用
   */
  const handleNotificationAction = useCallback(
    (notificationId: string, actionId: string) => {
      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification) return;

      // Flow D：健身教练的训练负荷建议
      if (notification.agentId === 'fitness-coach') {
        if (actionId === 'accept') {
          // 接受建议 → 添加低强度心肺恢复训练到日历
          const nextDate = getNextAvailableDate();
          useCalendarStore.getState().addEvents([
            {
              id: `cardio-recovery-${Date.now()}`,
              date: nextDate,
              time: '17:00',
              title: '低强度心肺恢复 · 30分钟',
              type: 'cardio',
              agentId: 'fitness-coach',
            },
          ]);
        }
        // "稍后再说"不需要额外副作用
      }

      // Flow E：私人助理的行程冲突
      if (notification.agentId === 'personal-assistant') {
        if (actionId === 'cancel-training') {
          // 取消本次训练 → 移除冲突的训练日历事件 + 跳过训练
          const conflictDate = '2026-05-16'; // 5/16 周六训练日
          const conflictEvents = useCalendarStore.getState().detectConflict(conflictDate);
          const trainingEvent = conflictEvents.find((e) => e.type === 'training');
          if (trainingEvent) {
            useCalendarStore.getState().removeEvent(trainingEvent.id);
          }
          useTrainingStore.getState().skipSession(conflictDate);
        }
        if (actionId === 'reschedule') {
          // 换个时间 → 移除原训练，加到新日期
          const conflictDate = '2026-05-16';
          const conflictEvents = useCalendarStore.getState().detectConflict(conflictDate);
          const trainingEvent = conflictEvents.find((e) => e.type === 'training');
          if (trainingEvent) {
            useCalendarStore.getState().removeEvent(trainingEvent.id);
            // 挪到 5/18 周一
            useCalendarStore.getState().addEvents([
              {
                ...trainingEvent,
                id: `rescheduled-${Date.now()}`,
                date: '2026-05-18',
              },
            ]);
          }
        }
      }

      // 统一标记为已处理
      markHandled(notificationId, actionId);
    },
    [notifications, markHandled],
  );

  return (
    <div className={styles.page}>
      <NavBar title="通知" />
      <div className={styles.content}>
        {notifications.length === 0 ? (
          <p className={styles.empty}>暂无通知</p>
        ) : (
          <div className={styles.list}>
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onAction={handleNotificationAction}
              />
            ))}
          </div>
        )}
      </div>
      <BottomTabBar />
    </div>
  );
}

/**
 * 获取下一个可用日期（从明天开始，找到第一个没有训练安排的日期）
 */
function getNextAvailableDate(): string {
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const conflicts = useCalendarStore.getState().detectConflict(dateStr);
    if (conflicts.length === 0) {
      return dateStr;
    }
  }
  // 兜底：3天后
  const fallback = new Date(now);
  fallback.setDate(now.getDate() + 3);
  return fallback.toISOString().split('T')[0];
}
