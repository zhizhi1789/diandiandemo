import { useState } from 'react';
import StructuredCard from '@/components/StructuredCard';
import OptionButton, { OptionGroup } from '@/components/OptionButton';
import styles from './SkillRecommendCard.module.css';

interface SkillRecommendCardProps {
  /** 推荐文案 */
  recommendation: string;
  /** Skill 描述内容 */
  skillDescription: string;
  /** 使用人数标签 */
  usageLabel?: string;
  /** 用户选择回调：'use' | 'skip' */
  onSelect: (optionId: string) => void;
}

export default function SkillRecommendCard({
  recommendation,
  skillDescription,
  usageLabel,
  onSelect,
}: SkillRecommendCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleSelect = (optionId: string) => {
    if (selectedId) return;
    setSelectedId(optionId);
    onSelect(optionId);
  };

  // 描述文案截断处理
  const TRUNCATE_LENGTH = 60;
  const needsTruncate = skillDescription.length > TRUNCATE_LENGTH;
  const displayText =
    expanded || !needsTruncate
      ? skillDescription
      : skillDescription.slice(0, TRUNCATE_LENGTH) + '...';

  return (
    <StructuredCard title="✨ 发现适合你的 Skill">
      {/* 推荐理由 */}
      <p className={styles.recommendation}>{recommendation}</p>

      {/* 使用人数标签 */}
      {usageLabel && (
        <div className={styles.usageBadge}>
          <span className={styles.usageIcon}>🔥</span>
          <span>{usageLabel}</span>
        </div>
      )}

      {/* Skill 描述区域 */}
      <div className={styles.skillBox}>
        <div className={styles.skillHeader}>
          <span className={styles.skillIcon}>📖</span>
          <span className={styles.skillTitle}>Skill 详情</span>
        </div>
        <p className={styles.skillDescription}>
          {displayText}
          {needsTruncate && !expanded && (
            <button
              className={styles.expandBtn}
              onClick={() => setExpanded(true)}
            >
              查看更多
            </button>
          )}
        </p>
      </div>

      {/* 选择器 */}
      <OptionGroup>
        <OptionButton
          label="使用"
          selected={selectedId === 'use'}
          disabled={selectedId !== null && selectedId !== 'use'}
          onClick={() => handleSelect('use')}
        />
        <OptionButton
          label="不使用"
          selected={selectedId === 'skip'}
          disabled={selectedId !== null && selectedId !== 'skip'}
          onClick={() => handleSelect('skip')}
        />
      </OptionGroup>
    </StructuredCard>
  );
}
