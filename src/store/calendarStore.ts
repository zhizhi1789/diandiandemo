import { create } from 'zustand';
import type { CalendarEvent } from '@/types';

interface CalendarState {
  events: CalendarEvent[];
  addEvents: (events: CalendarEvent[]) => void;
  removeEvent: (eventId: string) => void;
  detectConflict: (date: string) => CalendarEvent[];
  reset: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],

  addEvents: (newEvents) =>
    set((state) => ({
      events: [...state.events, ...newEvents],
    })),

  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    })),

  detectConflict: (date) => {
    return get().events.filter((e) => e.date === date);
  },

  reset: () => set({ events: [] }),
}));
