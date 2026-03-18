import type { TrainingPlan } from '@/types';
import StructuredCard from '@/components/StructuredCard';
import styles from './TrainingPlanCard.module.css';

interface TrainingPlanCardProps {
  plan: TrainingPlan;
}

export default function TrainingPlanCard({ plan }: TrainingPlanCardProps) {
  return (
    <StructuredCard title="🎯 你的个性化训练计划">
      {/* 计划概要 */}
      <div className={styles.summary}>
        <SummaryRow label="训练目标" value={plan.goal} />
        <SummaryRow label="每周频次" value={`${plan.weeklyFrequency} 次`} />
        <SummaryRow label="适用周期" value={`${plan.cycleWeeks} 周`} />
        <SummaryRow label="下次评估" value={plan.nextEvaluation} />
      </div>

      {/* 3 天训练安排 */}
      <div className={styles.dayList}>
        {plan.days.map((day) => (
          <div key={day.id} className={styles.dayCard}>
            {/* 日期头部 */}
            <div className={styles.dayHeader}>
              <span className={styles.dayLabel}>{day.dayOfWeek} {day.time}</span>
            </div>
            <div className={styles.dayMeta}>
              <span className={styles.dayName}>{day.name}</span>
              <span className={styles.dayStats}>
                {day.durationMinutes}分钟 · {day.exerciseCount}个动作 · ~{day.estimatedCalories}kcal
              </span>
            </div>

            {/* 动作列表 */}
            <div className={styles.exerciseList}>
              {day.exercises.map((exercise, idx) => (
                <div key={exercise.id} className={styles.exerciseItem}>
                  <span className={styles.exerciseDot}>
                    {idx < day.exercises.length - 1 ? '├' : '└'}
                  </span>
                  <span className={styles.exerciseName}>{exercise.name}</span>
                  <span className={styles.exerciseDetail}>
                    {exercise.sets}组 × {exercise.reps}
                    {exercise.weight ? ` · ${exercise.weight}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StructuredCard>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryRow}>
      <span className={styles.summaryLabel}>{label}</span>
      <span className={styles.summaryValue}>{value}</span>
    </div>
  );
}
