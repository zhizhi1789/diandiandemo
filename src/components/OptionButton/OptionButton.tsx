import styles from './OptionButton.module.css';

interface OptionButtonProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function OptionButton({ label, selected = false, disabled = false, onClick }: OptionButtonProps) {
  return (
    <button
      className={`${styles.option} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

/** 多个 OptionButton 的布局容器 */
export function OptionGroup({ children }: { children: React.ReactNode }) {
  return <div className={styles.optionGroup}>{children}</div>;
}
