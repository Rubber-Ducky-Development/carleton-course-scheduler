import { create } from 'zustand';

export interface ScheduleCourse {
  courseCode: string;
  title: string;
  instructor: string;
  sectionType: string;
  times: {
    day: string;
    start: string;
    end: string;
    timeOfDay: string;
  }[];
  matchReason?: string;
  // For the new format where required sessions are separate courses
  isRequiredSession?: boolean;
  requiredFor?: string;
  // For backward compatibility with old format
  requiredSessions?: {
    crn: string;
    courseCode: string;
    title: string;
    section: string;
    instructor: string;
    sectionType: string;
    times: {
      day: string;
      start: string;
      end: string;
      timeOfDay: string;
    }[];
    location: string;
    isRequired: boolean;
  }[];
}

interface ScheduleState {
  generatedSchedule: ScheduleCourse[] | null;
  alternativeSchedules: ScheduleCourse[][] | null;
  currentAlternative: number | null;
  isDemo: boolean;
  message: string | null;
  
  // Actions
  setSchedule: (
    schedule: ScheduleCourse[], 
    alternativeSchedules: ScheduleCourse[][] | null,
    isDemo: boolean, 
    message: string | null
  ) => void;
  clearSchedule: () => void;
  setCurrentAlternative: (alternativeIndex: number | null) => void;
  getCurrentSchedule: () => ScheduleCourse[] | null;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  generatedSchedule: null,
  alternativeSchedules: null,
  currentAlternative: null,
  isDemo: false,
  message: null,
  
  // Actions
  setSchedule: (schedule, alternativeSchedules, isDemo, message) => set({
    generatedSchedule: schedule,
    alternativeSchedules,
    currentAlternative: null,
    isDemo,
    message
  }),
  
  clearSchedule: () => set({
    generatedSchedule: null,
    alternativeSchedules: null,
    currentAlternative: null,
    isDemo: false,
    message: null
  }),
  
  setCurrentAlternative: (alternativeIndex) => set({
    currentAlternative: alternativeIndex
  }),
  
  getCurrentSchedule: () => {
    const state = get();
    if (state.currentAlternative !== null && state.alternativeSchedules && state.alternativeSchedules[state.currentAlternative]) {
      return state.alternativeSchedules[state.currentAlternative];
    }
    return state.generatedSchedule;
  }
}));
