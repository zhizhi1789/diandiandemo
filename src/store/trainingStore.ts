import { create } from 'zustand';
import type { TrainingPlan, TrainingRecord, ExerciseModification, Exercise } from '@/types';

interface TrainingState {
  planCreated: boolean;
  currentPlan: TrainingPlan | null;
  todayProgress: {
    started: boolean;
    completedExercises: string[];
    modifications: ExerciseModification[];
  };
  trainingHistory: TrainingRecord[];
  lastFeedback: 'easy' | 'normal' | 'hard' | null;

  createPlan: (plan: TrainingPlan) => void;
  startTraining: () => void;
  completeExercise: (exerciseId: string) => void;
  addExercise: (dayId: string, exercise: Exercise) => void;
  removeExercise: (dayId: string, exerciseId: string) => void;
  adjustSets: (exerciseId: string, newSets: number) => void;
  setFeedback: (feedback: 'easy' | 'normal' | 'hard') => void;
  saveTrainingRecord: (record: TrainingRecord) => void;
  skipSession: (date: string) => void;
  reset: () => void;
}

const initialTodayProgress = {
  started: false,
  completedExercises: [] as string[],
  modifications: [] as ExerciseModification[],
};

export const useTrainingStore = create<TrainingState>((set) => ({
  planCreated: false,
  currentPlan: null,
  todayProgress: { ...initialTodayProgress },
  trainingHistory: [],
  lastFeedback: null,

  createPlan: (plan) =>
    set({ currentPlan: plan, planCreated: true }),

  startTraining: () =>
    set((state) => ({
      todayProgress: { ...state.todayProgress, started: true },
    })),

  completeExercise: (exerciseId) =>
    set((state) => ({
      todayProgress: {
        ...state.todayProgress,
        completedExercises: [...state.todayProgress.completedExercises, exerciseId],
      },
    })),

  addExercise: (dayId, exercise) =>
    set((state) => {
      if (!state.currentPlan) return state;
      const newPlan = { ...state.currentPlan };
      newPlan.days = newPlan.days.map((d) =>
        d.id === dayId ? { ...d, exercises: [...d.exercises, exercise] } : d
      );
      return { currentPlan: newPlan };
    }),

  removeExercise: (dayId, exerciseId) =>
    set((state) => {
      if (!state.currentPlan) return state;
      const newPlan = { ...state.currentPlan };
      newPlan.days = newPlan.days.map((d) =>
        d.id === dayId
          ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) }
          : d
      );
      return { currentPlan: newPlan };
    }),

  adjustSets: (exerciseId, newSets) =>
    set((state) => ({
      todayProgress: {
        ...state.todayProgress,
        modifications: [
          ...state.todayProgress.modifications.filter(
            (m) => !(m.exerciseId === exerciseId && m.type === 'adjust-sets')
          ),
          { type: 'adjust-sets', exerciseId, newSets },
        ],
      },
    })),

  setFeedback: (feedback) => set({ lastFeedback: feedback }),

  saveTrainingRecord: (record) =>
    set((state) => ({
      trainingHistory: [...state.trainingHistory, record],
      todayProgress: { ...initialTodayProgress },
    })),

  skipSession: (_date) => {
    // Mock: just acknowledge
  },

  reset: () =>
    set({
      planCreated: false,
      currentPlan: null,
      todayProgress: { ...initialTodayProgress },
      trainingHistory: [],
      lastFeedback: null,
    }),
}));
