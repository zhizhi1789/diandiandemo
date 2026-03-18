import StructuredCard from '@/components/StructuredCard';
import CTAButton from '@/components/CTAButton';
import { useTrainingStore } from '@/store/trainingStore';
import styles from './TrainingReminderCard.module.css';

interface TrainingReminderCardProps {
  onStartTraining: () => void;
}

const PREP_ITEMS = [
  '运动鞋和毛巾',
  '训练前 30 分钟补充碳水',
  '准备好水杯',
];

export default function TrainingReminderCard({ onStartTraining }: TrainingReminderCardProps) {
  const currentPlan = useTrainingStore((s) => s.currentPlan);
  // Demo 演示取第一天
  const today = currentPlan?.days[0];

  if (!today) return null;

  return (
    <StructuredCard>
      <div className={styles.header}>
        <span className={styles.icon}>💪</span>
        <span className={styles.title}>今天是训练日！</span>
      </div>

      <div className={styles.info}>
        <InfoRow label="主题" value={today.name} />
        <InfoRow label="时长" value={`约 ${today.durationMinutes} 分钟`} />
        <InfoRow label="动作数" value={`${today.exerciseCount} 个`} />
      </div>

      <div className={styles.prepSection}>
        <div className={styles.prepTitle}>准备事项：</div>
        <ul className={styles.prepList}>
          {PREP_ITEMS.map((item, idx) => (
            <li key={idx} className={styles.prepItem}>
              <span className={styles.dot}>·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <CTAButton onClick={onStartTraining}>
        ▶ 开始训练
      </CTAButton>
    </StructuredCard>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}
