import { agents } from '@/data/agents';
import styles from './AgentAvatar.module.css';

const AGENT_COLORS: Record<string, [string, string]> = {
  'personal-assistant': ['#7EDBCE', '#4FCFBC'],
  'fitness-coach': ['#FFB088', '#FF8C6B'],
  'nutritionist': ['#9DD1F5', '#7CB9E8'],
};

interface AgentAvatarProps {
  agentId: string;
  size?: number;
}

export default function AgentAvatar({ agentId, size = 48 }: AgentAvatarProps) {
  const colors = AGENT_COLORS[agentId] ?? ['#CCCCCC', '#AAAAAA'];
  const [from, to] = colors;
  const agent = agents.find((a) => a.id === agentId);
  const initial = agent?.icon ?? '?';
  const gradId = `avatar-grad-${agentId}`;

  return (
    <div className={styles.avatar}>
      <svg width={size} height={size} viewBox="0 0 48 48">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="24" fill={`url(#${gradId})`} />
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="20"
          fontWeight="600"
        >
          {initial}
        </text>
      </svg>
    </div>
  );
}
