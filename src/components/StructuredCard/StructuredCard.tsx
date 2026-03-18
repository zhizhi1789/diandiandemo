import type { ReactNode } from 'react';
import styles from './StructuredCard.module.css';

interface StructuredCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function StructuredCard({ children, title, subtitle, className }: StructuredCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`}>
      {title && (
        <div>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
