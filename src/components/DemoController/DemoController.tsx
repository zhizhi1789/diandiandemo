import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/store/demoStore';
import { useTrainingStore } from '@/store/trainingStore';
import { useCalendarStore } from '@/store/calendarStore';
import { useNotificationStore } from '@/store/notificationStore';
import styles from './DemoController.module.css';

/**
 * 演示调试面板
 * 长按右下角触发器 1.5 秒激活，提供：
 * - 快进模式切换
 * - 重置 Demo 到初始状态
 * - 跳转到指定 Agent 对话页
 */
export default function DemoController() {
  const [isOpen, setIsOpen] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  const { fastForward, toggleFastForward, currentPhase, reset: resetDemo } = useDemoStore();

  const handlePointerDown = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      setIsOpen((prev) => !prev);
    }, 1500);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  /** 重置所有 Store + 回到首页 */
  const handleResetAll = useCallback(() => {
    resetDemo();
    useTrainingStore.getState().reset();
    useCalendarStore.getState().reset();
    useNotificationStore.getState().reset();
    navigate('/');
    setIsOpen(false);
  }, [resetDemo, navigate]);

  /** 跳转到指定 Agent 对话页 */
  const handleJumpTo = useCallback(
    (agentId: string) => {
      navigate(`/agent/${agentId}`);
      setIsOpen(false);
    },
    [navigate],
  );

  return (
    <>
      {/* 触发器按钮 — 长按 1.5 秒激活 */}
      <div
        className={styles.trigger}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <span className={styles.triggerIcon}>⚙</span>
      </div>

      {/* 调试面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className={styles.panelTitle}>🎛 演示控制</div>

            {/* 当前状态 */}
            <div className={styles.section}>
              <div className={styles.phaseIndicator}>
                当前阶段:
                <span className={styles.phaseBadge}>{currentPhase}</span>
              </div>
            </div>

            {/* 快进模式 */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>模式</div>
              <div
                className={styles.toggle}
                onClick={toggleFastForward}
              >
                <span className={styles.toggleLabel}>⚡ 快进模式</span>
                <div className={`${styles.toggleSwitch} ${fastForward ? styles.toggleSwitchActive : ''}`}>
                  <div className={`${styles.toggleDot} ${fastForward ? styles.toggleDotActive : ''}`} />
                </div>
              </div>
            </div>

            {/* 快速跳转 */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>跳转到</div>
              <div className={styles.btnGroup}>
                <button className={styles.btn} onClick={() => navigate('/')}>
                  首页
                </button>
                <button className={styles.btn} onClick={() => handleJumpTo('fitness-coach')}>
                  健身教练
                </button>
                <button className={styles.btn} onClick={() => handleJumpTo('personal-assistant')}>
                  私人助理
                </button>
                <button className={styles.btn} onClick={() => navigate('/notifications')}>
                  通知页
                </button>
              </div>
            </div>

            {/* 重置 */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>操作</div>
              <div className={styles.btnGroup}>
                <button
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={handleResetAll}
                >
                  🔄 重置 Demo
                </button>
                <button className={styles.btn} onClick={() => setIsOpen(false)}>
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
