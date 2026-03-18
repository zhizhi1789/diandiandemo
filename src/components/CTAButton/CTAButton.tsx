import type { ReactNode } from 'react';
import styles from './CTAButton.module.css';

interface CTAButtonProps {
  children: ReactNode;
  variant?: 'capsule' | 'full';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CTAButton({
  children,
  variant = 'full',
  disabled = false,
  onClick,
  className,
}: CTAButtonProps) {
  return (
    <button
      className={`${styles.base} ${styles[variant]} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
