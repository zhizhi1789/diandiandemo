import StructuredCard from '@/components/StructuredCard';
import styles from './WeeklyStatsCard.module.css';

interface WeeklyStatsCardProps {
  /** 总训练时长（分钟） */
  totalDuration: number;
  /** 总消耗卡路里 */
  totalCalories: number;
  /** 最喜欢的动作 */
  favoriteExercise: string;
  /** 最高心率 */
  peakHeartRate: number;
}

export default function WeeklyStatsCard({
  totalDuration,
  totalCalories,
  favoriteExercise,
  peakHeartRate,
}: WeeklyStatsCardProps) {
  return (
    <StructuredCard>
      <div className={styles.header}>
        <span className={styles.icon}>🏆</span>
        <span className={styles.title}>第一周训练报告</span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>总计训练时长</div>
          <div className={styles.statValue}>
            {totalDuration} <span className={styles.statUnit}>分钟</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>总计消耗卡路里</div>
          <div className={styles.statValue}>
            {totalCalories} <span className={styles.statUnit}>kcal</span>
          </div>
        </div>
      </div>

      <div className={styles.highlightList}>
        <div className={styles.highlightItem}>
          <span className={styles.highlightIcon}>💪</span>
          <div className={styles.highlightContent}>
            <div className={styles.highlightLabel}>你最喜欢做的动作</div>
            <div className={styles.highlightValue}>{favoriteExercise}</div>
          </div>
        </div>
        <div className={styles.highlightItem}>
          <span className={styles.highlightIcon}>❤️‍🔥</span>
          <div className={styles.highlightContent}>
            <div className={styles.highlightLabel}>你的心率最高飙到</div>
            <div className={styles.highlightValue}>{peakHeartRate} bpm</div>
          </div>
        </div>
      </div>
    </StructuredCard>
  );
}
