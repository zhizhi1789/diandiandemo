import { useState } from 'react';
import StructuredCard from '@/components/StructuredCard';
import { useTrainingStore } from '@/store/trainingStore';
import styles from './TrainingSummaryCard.module.css';

interface TrainingSummaryCardProps {
  duration: number;
  avgHeartRate: number;
  caloriesBurned: number;
  maxHeartRate: number;
  minHeartRate: number;
  onFeedbackSelect: (feedback: string) => void;
}

const FEEDBACK_OPTIONS: { id: 'easy' | 'normal' | 'hard'; label: string; emoji: string }[] = [
  { id: 'easy', label: '轻松', emoji: '😊' },
  { id: 'normal', label: '正常', emoji: '💪' },
  { id: 'hard', label: '吃力', emoji: '😤' },
];

export default function TrainingSummaryCard({
  duration,
  avgHeartRate,
  caloriesBurned,
  maxHeartRate,
  minHeartRate,
  onFeedbackSelect,
}: TrainingSummaryCardProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const completedExercises = useTrainingStore((s) => s.todayProgress.completedExercises);
  const currentPlan = useTrainingStore((s) => s.currentPlan);
  const setFeedback = useTrainingStore((s) => s.setFeedback);

  const totalExercises = currentPlan?.days[0]?.exercises.length ?? 6;
  const completedCount = completedExercises.length;

  const handleFeedback = (feedback: 'easy' | 'normal' | 'hard') => {
    if (selectedFeedback) return;
    setSelectedFeedback(feedback);
    setFeedback(feedback);
    onFeedbackSelect(feedback);
  };

  return (
    <StructuredCard>
      <div className={styles.header}>
        <span className={styles.icon}>🏋️</span>
        <span className={styles.title}>本次训练总结</span>
      </div>

      {/* 数据网格 */}
      <div className={styles.statsGrid}>
        <StatItem label="总时长" value={`${duration} 分钟`} />
        <StatItem label="平均心率" value={`${avgHeartRate} bpm`} />
        <StatItem label="预估消耗" value={`${caloriesBurned} kcal`} />
        <StatItem label="完成动作" value={`${completedCount}/${totalExercises}`} />
      </div>

      {/* 心率区间 */}
      <div className={styles.heartRateSection}>
        <div className={styles.hrLabel}>心率区间</div>
        <div className={styles.hrBar}>
          <div className={styles.hrBarTrack}>
            <div
              className={styles.hrBarFill}
              style={{
                left: `${((minHeartRate - 60) / (200 - 60)) * 100}%`,
                width: `${((maxHeartRate - minHeartRate) / (200 - 60)) * 100}%`,
              }}
            />
            <div
              className={styles.hrBarAvg}
              style={{
                left: `${((avgHeartRate - 60) / (200 - 60)) * 100}%`,
              }}
            />
          </div>
          <div className={styles.hrLabels}>
            <span>{minHeartRate}</span>
            <span className={styles.hrAvgLabel}>均值 {avgHeartRate}</span>
            <span>{maxHeartRate}</span>
          </div>
        </div>
      </div>

      {/* 主观感受 */}
      <div className={styles.feedbackSection}>
        <div className={styles.feedbackLabel}>你的主观感受：</div>
        <div className={styles.feedbackOptions}>
          {FEEDBACK_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`${styles.feedbackBtn} ${selectedFeedback === opt.id ? styles.feedbackSelected : ''} ${selectedFeedback && selectedFeedback !== opt.id ? styles.feedbackDisabled : ''}`}
              onClick={() => handleFeedback(opt.id)}
              disabled={!!selectedFeedback}
            >
              <span className={styles.feedbackEmoji}>{opt.emoji}</span>
              <span className={styles.feedbackText}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </StructuredCard>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statItem}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}
