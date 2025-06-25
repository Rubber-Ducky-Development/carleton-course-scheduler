import { create } from 'zustand';

export type Semester = 'fall' | 'winter';

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
  currentSemester: Semester;
  schedules: {
    fall: {
      generatedSchedule: ScheduleCourse[] | null;
      alternativeSchedules: ScheduleCourse[][] | null;
      currentAlternative: number | null;
      isDemo: boolean;
      message: string | null;
    };
    winter: {
      generatedSchedule: ScheduleCourse[] | null;
      alternativeSchedules: ScheduleCourse[][] | null;
      currentAlternative: number | null;
      isDemo: boolean;
      message: string | null;
    };
  };
  
  // Actions
  setSemester: (semester: Semester) => void;
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
  currentSemester: 'fall',
  schedules: {
    fall: {
      generatedSchedule: null,
      alternativeSchedules: null,
      currentAlternative: null,
      isDemo: false,
      message: null,
    },
    winter: {
      generatedSchedule: null,
      alternativeSchedules: null,
      currentAlternative: null,
      isDemo: false,
      message: null,
    }
  },
  
  // Actions
  setSemester: (semester: Semester) => set({ currentSemester: semester }),
  
  setSchedule: (schedule, alternativeSchedules, isDemo, message) => set((state) => ({
    schedules: {
      ...state.schedules,
      [state.currentSemester]: {
        generatedSchedule: schedule,
        alternativeSchedules,
        currentAlternative: null,
        isDemo,
        message
      }
    }
  })),
  
  clearSchedule: () => set((state) => ({
    schedules: {
      ...state.schedules,
      [state.currentSemester]: {
        generatedSchedule: null,
        alternativeSchedules: null,
        currentAlternative: null,
        isDemo: false,
        message: null
      }
    }
  })),
  
  setCurrentAlternative: (alternativeIndex) => set((state) => ({
    schedules: {
      ...state.schedules,
      [state.currentSemester]: {
        ...state.schedules[state.currentSemester],
        currentAlternative: alternativeIndex
      }
    }
  })),
  
  getCurrentSchedule: () => {
    const state = get();
    const currentScheduleData = state.schedules[state.currentSemester];
    if (currentScheduleData.currentAlternative !== null && 
        currentScheduleData.alternativeSchedules && 
        currentScheduleData.alternativeSchedules[currentScheduleData.currentAlternative]) {
      return currentScheduleData.alternativeSchedules[currentScheduleData.currentAlternative];
    }
    return currentScheduleData.generatedSchedule;
  }
}));
