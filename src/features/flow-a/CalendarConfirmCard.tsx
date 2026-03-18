import { useState } from 'react';
import StructuredCard from '@/components/StructuredCard';
import OptionButton, { OptionGroup } from '@/components/OptionButton';
import styles from './CalendarConfirmCard.module.css';

interface CalendarOption {
  id: string;
  label: string;
}

interface CalendarConfirmCardProps {
  description: string;
  options: CalendarOption[];
  onSelect: (optionId: string) => void;
}

export default function CalendarConfirmCard({
  description,
  options,
  onSelect,
}: CalendarConfirmCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (selectedId) return; // 已选择，不可重复操作
    setSelectedId(optionId);
    onSelect(optionId);
  };

  return (
    <StructuredCard title="📅 加入日历">
      <p className={styles.description}>{description}</p>
      <OptionGroup>
        {options.map((opt) => (
          <OptionButton
            key={opt.id}
            label={opt.label}
            selected={selectedId === opt.id}
            disabled={selectedId !== null && selectedId !== opt.id}
            onClick={() => handleSelect(opt.id)}
          />
        ))}
      </OptionGroup>
    </StructuredCard>
  );
}
