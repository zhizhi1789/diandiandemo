import { create } from 'zustand';

type DemoPhase = 'idle' | 'flow-a' | 'flow-b' | 'flow-c' | 'flow-d' | 'flow-e';

interface DemoState {
  currentPhase: DemoPhase;
  fastForward: boolean;
  setPhase: (phase: DemoPhase) => void;
  toggleFastForward: () => void;
  reset: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  currentPhase: 'idle',
  fastForward: false,

  setPhase: (phase) => set({ currentPhase: phase }),
  toggleFastForward: () => set((state) => ({ fastForward: !state.fastForward })),
  reset: () => set({ currentPhase: 'idle', fastForward: false }),
}));
