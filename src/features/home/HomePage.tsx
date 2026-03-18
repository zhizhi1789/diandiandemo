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
        <div className={styles.greeting}>
          <h1 className={styles.hello}>你好，小林</h1>
          <p className={styles.subtitle}>今天有什么想做的？</p>
        </div>
        <div className={styles.agentList}>
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}
