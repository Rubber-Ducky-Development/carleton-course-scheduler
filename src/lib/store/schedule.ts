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
}

interface ScheduleState {
  generatedSchedule: ScheduleCourse[] | null;
  isDemo: boolean;
  message: string | null;
  
  // Actions
  setSchedule: (schedule: ScheduleCourse[], isDemo: boolean, message: string | null) => void;
  clearSchedule: () => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  generatedSchedule: null,
  isDemo: false,
  message: null,
  
  // Actions
  setSchedule: (schedule, isDemo, message) => set({
    generatedSchedule: schedule,
    isDemo,
    message
  }),
  
  clearSchedule: () => set({
    generatedSchedule: null,
    isDemo: false,
    message: null
  })
}));
