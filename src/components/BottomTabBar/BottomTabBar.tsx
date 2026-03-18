import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bell, User } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import styles from './BottomTabBar.module.css';

const tabs = [
  { id: 'home', label: '首页', icon: Home, path: '/' },
  { id: 'notifications', label: '通知', icon: Bell, path: '/notifications' },
  { id: 'me', label: '我的', icon: User, path: '/me' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <div className={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || 
          (tab.path === '/' && location.pathname === '/');
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
              {tab.id === 'notifications' && unreadCount > 0 && (
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
      })}
    </div>
  );
}
