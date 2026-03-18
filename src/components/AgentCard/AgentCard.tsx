import { useNavigate } from 'react-router-dom';
import type { Agent } from '@/types';
import AgentAvatar from '@/components/AgentAvatar';
import styles from './AgentCard.module.css';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/agent/${agent.id}`)}>
      <AgentAvatar agentId={agent.id} size={48} />
      <div className={styles.info}>
        <div className={styles.name}>{agent.name}</div>
        <div className={styles.description}>{agent.description}</div>
        {agent.lastMessage && (
          <div className={styles.lastMessage}>{agent.lastMessage}</div>
        )}
      </div>
    </div>
  );
}
