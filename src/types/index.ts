export * from './chat';

export interface Agent {
  id: string;
  name: string;
  description: string;
  lastMessage?: string;
  colorFrom: string;
  colorTo: string;
  icon: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g. "8-10次" or "30-45秒"
  weight?: string; // e.g. "15-20kg"
  targetMuscles: string[];
  caloriesPerSet: number;
  alternatives?: string[];
  completed?: boolean;
}

export interface TrainingDay {
  id: string;
  dayOfWeek: string;
  time: string;
  name: string;
  focus: string;
  durationMinutes: number;
  exerciseCount: number;
  estimatedCalories: number;
  exercises: Exercise[];
}

export interface TrainingPlan {
  goal: string;
  weeklyFrequency: number;
  cycleWeeks: number;
  nextEvaluation: string;
  days: TrainingDay[];
}

export interface ExerciseModification {
  type: 'add' | 'remove' | 'adjust-sets';
  exerciseId: string;
  newSets?: number;
  newExercise?: Exercise;
}

export interface TrainingRecord {
  date: string;
  dayType: string;
  duration: number;
  caloriesBurned: number;
  avgHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
  completedExercises: number;
  totalExercises: number;
  feedback?: 'easy' | 'normal' | 'hard';
}

export interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'training' | 'cardio' | 'travel' | 'other';
  agentId: string;
}

export interface NotificationItem {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  reason: string;
  suggestion: string;
  confirmText: string;
  actions: {
    id: string;
    label: string;
    primary?: boolean;
  }[];
  timestamp: number;
  read: boolean;
  handled: boolean;
}
