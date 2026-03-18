import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import DemoController from '@/components/DemoController';
import HomePage from '@/features/home/HomePage';
import NotificationPage from '@/features/notification/NotificationPage';
import AgentDetailPage from '@/features/agent-detail/AgentDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="agent/:agentId" element={<AgentDetailPage />} />
        </Route>
      </Routes>
      <DemoController />
    </BrowserRouter>
  );
}
