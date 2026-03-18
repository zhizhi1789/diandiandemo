import { useState } from 'react';
import StructuredCard from '@/components/StructuredCard';
import styles from './DataPermissionCard.module.css';

interface PermissionOption {
  id: string;
  label: string;
}

interface DataPermissionCardProps {
  description: string;
  options: PermissionOption[];
  onSelect: (optionId: string) => void;
}

export default function DataPermissionCard({
  description,
  options,
  onSelect,
}: DataPermissionCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (selectedId) return; // 已选择，不可更改
    setSelectedId(optionId);
    onSelect(optionId);
  };

  return (
    <StructuredCard>
      <div className={styles.header}>
        <span className={styles.icon}>📊</span>
        <span className={styles.title}>读取运动摘要</span>
      </div>

      <div className={styles.description}>{description}</div>

      <div className={styles.optionGroup}>
        {options.map((option) => (
          <button
            key={option.id}
            className={`${styles.option} ${selectedId === option.id ? styles.optionSelected : ''} ${selectedId && selectedId !== option.id ? styles.optionDisabled : ''}`}
            onClick={() => handleSelect(option.id)}
            disabled={!!selectedId}
          >
            {option.label}
          </button>
        ))}
      </div>
    </StructuredCard>
  );
}
