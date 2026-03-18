import { useState, useMemo, useCallback } from 'react';
import type { Exercise } from '@/types';
import StructuredCard from '@/components/StructuredCard';
import CTAButton from '@/components/CTAButton';
import { useTrainingStore } from '@/store/trainingStore';
import styles from './TodayTrainingCard.module.css';

interface TodayTrainingCardProps {
  onFinishTraining?: () => void;
}

export default function TodayTrainingCard({ onFinishTraining }: TodayTrainingCardProps) {
  const {
    currentPlan,
    todayProgress,
    completeExercise,
    addExercise,
    removeExercise,
    adjustSets,
  } = useTrainingStore();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showEditMenu, setShowEditMenu] = useState<'add' | 'remove' | 'adjust' | null>(null);

  // Demo 取第一天
  const today = currentPlan?.days[0];
  const exercises = today?.exercises ?? [];
  const completedIds = todayProgress.completedExercises;

  // 计算实时数据（随编辑变化）
  const { targetMuscles, estimatedCalories } = useMemo(() => {
    // 应用组数调整的 modifications
    const effectiveExercises = exercises.map((ex) => {
      const mod = todayProgress.modifications.find(
        (m) => m.exerciseId === ex.id && m.type === 'adjust-sets',
      );
      return mod?.newSets ? { ...ex, sets: mod.newSets } : ex;
    });

    const muscleSet = new Set<string>();
    let totalCalories = 0;

    for (const ex of effectiveExercises) {
      for (const m of ex.targetMuscles) muscleSet.add(m);
      totalCalories += ex.caloriesPerSet * ex.sets;
    }

    return {
      targetMuscles: Array.from(muscleSet),
      estimatedCalories: totalCalories,
    };
  }, [exercises, todayProgress.modifications]);

  const completionCount = completedIds.length;
  const totalCount = exercises.length;
  const progress = totalCount > 0 ? completionCount / totalCount : 0;

  const handleToggleComplete = useCallback(
    (exerciseId: string) => {
      if (!completedIds.includes(exerciseId)) {
        completeExercise(exerciseId);
      }
    },
    [completedIds, completeExercise],
  );

  const handleToggleExpand = useCallback((exerciseId: string) => {
    setExpandedId((prev) => (prev === exerciseId ? null : exerciseId));
  }, []);

  // 编辑操作
  const handleAddExercise = useCallback(() => {
    if (!today) return;
    const newExercise: Exercise = {
      id: `ex-added-${Date.now()}`,
      name: '哑铃侧平举',
      sets: 3,
      reps: '12次',
      weight: '3-4kg/只',
      targetMuscles: ['三角肌中束'],
      caloriesPerSet: 8,
      alternatives: ['绳索侧平举'],
    };
    addExercise(today.id, newExercise);
    setShowEditMenu(null);
  }, [today, addExercise]);

  const handleRemoveExercise = useCallback(
    (exerciseId: string) => {
      if (!today) return;
      removeExercise(today.id, exerciseId);
      setShowEditMenu(null);
    },
    [today, removeExercise],
  );

  const handleAdjustSets = useCallback(
    (exerciseId: string, delta: number) => {
      const ex = exercises.find((e) => e.id === exerciseId);
      if (!ex) return;
      const mod = todayProgress.modifications.find(
        (m) => m.exerciseId === exerciseId && m.type === 'adjust-sets',
      );
      const currentSets = mod?.newSets ?? ex.sets;
      const newSets = Math.max(1, Math.min(10, currentSets + delta));
      adjustSets(exerciseId, newSets);
    },
    [exercises, todayProgress.modifications, adjustSets],
  );

  if (!today) return null;

  return (
    <StructuredCard>
      {/* 进度条 */}
      <ProgressBar completed={completionCount} total={totalCount} progress={progress} />

      {/* 目标肌群 */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>目标肌群</div>
        <div className={styles.muscleList}>
          {targetMuscles.map((m) => (
            <span key={m} className={styles.muscleTag}>{m}</span>
          ))}
        </div>
        <div className={styles.calorieText}>
          预计消耗 ~{estimatedCalories} kcal
        </div>
      </div>

      {/* 动作列表 */}
      <div className={styles.exerciseList}>
        {exercises.map((exercise) => {
          // 应用组数修改
          const mod = todayProgress.modifications.find(
            (m) => m.exerciseId === exercise.id && m.type === 'adjust-sets',
          );
          const effectiveSets = mod?.newSets ?? exercise.sets;

          return (
            <ExerciseItem
              key={exercise.id}
              exercise={{ ...exercise, sets: effectiveSets }}
              completed={completedIds.includes(exercise.id)}
              expanded={expandedId === exercise.id}
              onToggleComplete={() => handleToggleComplete(exercise.id)}
              onToggleExpand={() => handleToggleExpand(exercise.id)}
              showRemove={showEditMenu === 'remove'}
              onRemove={() => handleRemoveExercise(exercise.id)}
              showAdjust={showEditMenu === 'adjust'}
              onAdjustSets={(delta) => handleAdjustSets(exercise.id, delta)}
            />
          );
        })}
      </div>

      {/* 编辑按钮组 */}
      <EditToolbar
        activeMenu={showEditMenu}
        onAdd={handleAddExercise}
        onToggleRemove={() => setShowEditMenu((p) => (p === 'remove' ? null : 'remove'))}
        onToggleAdjust={() => setShowEditMenu((p) => (p === 'adjust' ? null : 'adjust'))}
      />

      {/* 完成训练 CTA */}
      <CTAButton onClick={onFinishTraining}>
        ✓ 完成训练
      </CTAButton>
    </StructuredCard>
  );
}

/* ===== 子组件：进度条 ===== */

function ProgressBar({
  completed,
  total,
  progress,
}: {
  completed: number;
  total: number;
  progress: number;
}) {
  return (
    <div className={styles.progressSection}>
      <div className={styles.progressBarBg}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className={styles.progressText}>
        {completed}/{total} 已完成
      </div>
    </div>
  );
}

/* ===== 子组件：单个动作项 ===== */

interface ExerciseItemProps {
  exercise: Exercise;
  completed: boolean;
  expanded: boolean;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
  showRemove: boolean;
  onRemove: () => void;
  showAdjust: boolean;
  onAdjustSets: (delta: number) => void;
}

function ExerciseItem({
  exercise,
  completed,
  expanded,
  onToggleComplete,
  onToggleExpand,
  showRemove,
  onRemove,
  showAdjust,
  onAdjustSets,
}: ExerciseItemProps) {
  return (
    <div className={`${styles.exerciseCard} ${completed ? styles.exerciseCompleted : ''}`}>
      <div className={styles.exerciseMain} onClick={onToggleExpand}>
        {/* 完成标记 */}
        <button className={styles.checkBtn} onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}>
          {completed ? (
            <span className={styles.checkDone}>✅</span>
          ) : (
            <span className={styles.checkEmpty}>○</span>
          )}
        </button>

        {/* 动作名称与详情 */}
        <div className={styles.exerciseInfo}>
          <div className={styles.exerciseName}>{exercise.name}</div>
          <div className={styles.exerciseDetail}>
            {exercise.sets}组 × {exercise.reps}
            {exercise.weight ? ` · ${exercise.weight}` : ''}
          </div>
        </div>

        {/* 展开箭头 */}
        <span className={`${styles.expandArrow} ${expanded ? styles.expandArrowOpen : ''}`}>
          ▾
        </span>
      </div>

      {/* 展开区域 */}
      {expanded && (
        <div className={styles.expandedContent}>
          {/* 目标肌群 */}
          <div className={styles.expandRow}>
            <span className={styles.expandLabel}>目标肌群</span>
            <span className={styles.expandValue}>{exercise.targetMuscles.join(' · ')}</span>
          </div>
          {/* 每组消耗 */}
          <div className={styles.expandRow}>
            <span className={styles.expandLabel}>每组消耗</span>
            <span className={styles.expandValue}>~{exercise.caloriesPerSet} kcal</span>
          </div>
          {/* 替代动作 */}
          {exercise.alternatives && exercise.alternatives.length > 0 && (
            <div className={styles.expandRow}>
              <span className={styles.expandLabel}>替代动作</span>
              <span className={styles.expandValue}>{exercise.alternatives.join(' / ')}</span>
            </div>
          )}

          {/* 组数调整 */}
          {showAdjust && (
            <div className={styles.adjustRow}>
              <span className={styles.adjustLabel}>调整组数</span>
              <div className={styles.adjustControls}>
                <button className={styles.adjustBtn} onClick={() => onAdjustSets(-1)}>−</button>
                <span className={styles.adjustValue}>{exercise.sets}</span>
                <button className={styles.adjustBtn} onClick={() => onAdjustSets(1)}>+</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 删除模式下的删除按钮 */}
      {showRemove && (
        <button className={styles.removeBtn} onClick={onRemove}>
          删除
        </button>
      )}
    </div>
  );
}

/* ===== 子组件：编辑按钮组 ===== */

function EditToolbar({
  activeMenu,
  onAdd,
  onToggleRemove,
  onToggleAdjust,
}: {
  activeMenu: 'add' | 'remove' | 'adjust' | null;
  onAdd: () => void;
  onToggleRemove: () => void;
  onToggleAdjust: () => void;
}) {
  return (
    <div className={styles.editToolbar}>
      <button
        className={styles.editBtn}
        onClick={onAdd}
      >
        + 动作
      </button>
      <button
        className={`${styles.editBtn} ${activeMenu === 'remove' ? styles.editBtnActive : ''}`}
        onClick={onToggleRemove}
      >
        - 动作
      </button>
      <button
        className={`${styles.editBtn} ${activeMenu === 'adjust' ? styles.editBtnActive : ''}`}
        onClick={onToggleAdjust}
      >
        调整组数
      </button>
    </div>
  );
}
