import { create } from 'zustand';
import type { NotificationItem } from '@/types';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: NotificationItem) => void;
  markAsRead: (id: string) => void;
  handleAction: (id: string, actionId: string) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (item) =>
    set((state) => ({
      notifications: [item, ...state.notifications],
      unreadCount: state.unreadCount + (item.read ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  handleAction: (id, _actionId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, handled: true, read: true } : n
      ),
      unreadCount: state.notifications.find((n) => n.id === id && !n.read)
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    })),

  reset: () => set({ notifications: [], unreadCount: 0 }),
}));
