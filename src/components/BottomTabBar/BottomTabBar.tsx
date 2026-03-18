import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bell, Mic } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import styles from './BottomTabBar.module.css';

const tabs = [
  { id: 'home', label: '聊天', icon: Home, path: '/' },
  { id: 'notifications', label: '待确认', icon: Bell, path: '/notifications' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <div className={styles.tabBar}>
      {/* 首页 Tab */}
      {(() => {
        const tab = tabs[0];
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        );
      })()}

      {/* 中间语音按钮 */}
      <button className={styles.voiceButton} onTouchStart={() => {}} onTouchEnd={() => {}}>
        <Mic size={24} strokeWidth={2} />
      </button>

      {/* 待确认 Tab */}
      {(() => {
        const tab = tabs[1];
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className={styles.tabLabel}>{tab.label}</span>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  className={styles.badge}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                />
              )}
            </AnimatePresence>
          </button>
        );
      })()}
    </div>
  );
}
