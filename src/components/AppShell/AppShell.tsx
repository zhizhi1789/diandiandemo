import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, Wifi, Battery } from 'lucide-react';
import styles from './AppShell.module.css';

/** 页面转场动画变体 */
const pageVariants = {
  initial: { opacity: 0, x: 60 },
  in: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  out: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function AppShell() {
  const location = useLocation();
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className={styles.phoneContainer}>
      {/* 状态栏 */}
      <div className={styles.statusBar}>
        <span className={styles.statusTime}>{timeStr}</span>
        <div className={styles.statusIcons}>
          <Signal size={16} className={styles.statusIcon} />
          <Wifi size={16} className={styles.statusIcon} />
          <Battery size={16} className={styles.statusIcon} />
        </div>
      </div>

      {/* 内容区域 — 带页面转场动画 */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className={styles.pageWrapper}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Home Indicator */}
      <div className={styles.homeIndicator}>
        <div className={styles.homeIndicatorBar} />
      </div>
    </div>
  );
}
