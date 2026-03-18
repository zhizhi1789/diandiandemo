import type { ChatMessage } from '@/types';
import styles from './ChatBubble.module.css';

interface ChatBubbleProps {
  message: ChatMessage;
  showTimestamp?: boolean;
}

export default function ChatBubble({ message, showTimestamp = false }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.wrapperUser : styles.wrapperAi}`}>
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAi}`}>
        {message.text}
      </div>
      {showTimestamp && (
        <span className={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )}
    </div>
  );
}
