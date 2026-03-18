import NavBar from '@/components/NavBar';
import BottomTabBar from '@/components/BottomTabBar';
import AgentCard from '@/components/AgentCard';
import { agents } from '@/data/agents';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <NavBar title="点点" showBrandIcon />
      <div className={styles.content}>
        <div className={styles.chatList}>
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}
