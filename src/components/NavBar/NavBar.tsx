import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './NavBar.module.css';

interface NavBarProps {
  title: string;
  showBack?: boolean;
  showBrandIcon?: boolean;
  rightContent?: React.ReactNode;
}

function BrandIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" className={styles.brandIcon}>
      <defs>
        <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7EDBCE" />
          <stop offset="50%" stopColor="#76D6C5" />
          <stop offset="100%" stopColor="#6FD2BD" />
        </linearGradient>
      </defs>
      <rect width="16" height="16" rx="4" fill="url(#brand-grad)" />
      <text x="8" y="8" textAnchor="middle" dominantBaseline="central"
            fill="white" fontSize="9" fontWeight="600">点</text>
    </svg>
  );
}

export default function NavBar({ title, showBack = false, showBrandIcon = false, rightContent }: NavBarProps) {
  const navigate = useNavigate();

  return (
    <nav className={styles.navBar}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <div className={styles.center}>
        {showBrandIcon && <BrandIcon />}
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.right}>
        {rightContent}
      </div>
    </nav>
  );
}
