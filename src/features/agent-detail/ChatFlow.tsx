import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '@/types';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
import styles from './ChatFlow.module.css';

interface ChatFlowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  /** 渲染结构化卡片的回调。如果返回 null 则 fallback 到 ChatBubble */
  renderCard?: (message: ChatMessage) => React.ReactNode | null;
}

/** 消息出现动画：从底部淡入上滑 */
const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/** 结构化卡片出现动画：高度展开 + 淡入 */
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/** 打字指示器动画 */
const typingVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
};

export default function ChatFlow({ messages, isTyping, renderCard }: ChatFlowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 新消息或打字状态变化时自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  return (
    <div className={styles.chatFlow}>
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => {
          // 计算与上一条消息的间距
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const sameRole = prevMsg?.role === msg.role;
          const spacingClass =
            index === 0
              ? ''
              : sameRole
                ? styles.spacingSmall
                : styles.spacingLarge;

          // 系统消息
          if (msg.role === 'system') {
            return (
              <motion.div
                key={msg.id}
                className={`${styles.systemMessage} ${spacingClass}`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
              >
                {msg.text}
              </motion.div>
            );
          }

          // 尝试用自定义渲染器渲染结构化卡片
          const isCard = msg.contentType !== 'text' && renderCard;
          if (isCard) {
            const cardNode = renderCard(msg);
            if (cardNode) {
              return (
                <motion.div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${spacingClass}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cardNode}
                </motion.div>
              );
            }
          }

          // 默认：文本气泡
          return (
            <motion.div
              key={msg.id}
              className={`${styles.messageWrapper} ${spacingClass}`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              <ChatBubble message={msg} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {isTyping && (
          <motion.div
            key="typing-indicator"
            className={`${styles.messageWrapper} ${styles.spacingSmall}`}
            variants={typingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}
