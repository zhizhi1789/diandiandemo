import type { NotificationItem } from '@/types';
import AgentAvatar from '@/components/AgentAvatar';
import OptionButton from '@/components/OptionButton';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
  notification: NotificationItem;
  onAction?: (notificationId: string, actionId: string) => void;
}

export default function NotificationCard({ notification, onAction }: NotificationCardProps) {
  const timeStr = new Date(notification.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`${styles.card} ${notification.handled ? styles.handled : ''}`}>
      {/* 头部：Agent 头像 + 名称 + 时间 */}
      <div className={styles.header}>
        <AgentAvatar agentId={notification.agentId} size={32} />
        <span className={styles.agentName}>来自你的{notification.agentName}</span>
        <span className={styles.time}>{timeStr}</span>
      </div>

      {/* 为什么发起 */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>为什么发起：</div>
        <div className={styles.sectionContent}>{notification.reason}</div>
      </div>

      {/* 建议 */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>建议：</div>
        <div className={styles.sectionContent}>{notification.suggestion}</div>
      </div>

      {/* 确认文字 */}
      {notification.confirmText && (
        <div className={styles.confirmText}>
          ☑ {notification.confirmText}
        </div>
      )}

      {/* 操作按钮 */}
      {notification.handled ? (
        <div className={styles.handledBadge}>✓ 已处理</div>
      ) : (
        <div className={styles.actions}>
          {notification.actions.map((action) => (
            <OptionButton
              key={action.id}
              label={action.label}
              onClick={() => onAction?.(notification.id, action.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
