import { create } from 'zustand';
import {
    BufferTime,
    CoursePreference,
    DayOfWeek,
    SchedulerPreferences,
    SectionType,
    TimeOfDay
} from '../types/scheduler';

interface SchedulerState {
    preferences: SchedulerPreferences;

    // Course Actions
    addCourse: () => void;
    removeCourse: (index: number) => void;
    updateCourse: (index: number, course: CoursePreference) => void;
    updateCourseCode: (index: number, code: string) => void;
    updatePreferredInstructor: (index: number, instructor: string) => void;
    updateSectionTypes: (index: number, sectionTypes: SectionType[]) => void;

    // Buffer Time Actions
    updateBufferTime: (bufferTime: BufferTime) => void;

    // Availability Actions
    updateDayAvailability: (day: DayOfWeek, times: TimeOfDay[]) => void;
    updateMaxClassesPerDay: (day: DayOfWeek, max: number) => void;

    // Schedule Generation
    generateSchedule: () => Promise<void>;
    isGenerating: boolean;
}

// Initialize with default preferences
const initialPreferences: SchedulerPreferences = {
    courses: [{ courseCode: '', preferredInstructor: '', sectionTypes: [] }],
    bufferTime: 'No Buffer',
    dailyAvailability: [
        { day: 'Monday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 3 },
        { day: 'Tuesday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 3 },
        { day: 'Wednesday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 3 },
        { day: 'Thursday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 3 },
        { day: 'Friday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 3 },
    ],
};

export const useSchedulerStore = create<SchedulerState>((set, get) => ({
    preferences: initialPreferences,
    isGenerating: false,

    // Course Actions
    addCourse: () => set((state) => {
        // Only allow up to 7 courses
        if (state.preferences.courses.length >= 7) return state;
        return {
            preferences: {
                ...state.preferences,
                courses: [
                    ...state.preferences.courses,
                    { courseCode: '', preferredInstructor: '', sectionTypes: [] }
                ]
            }
        };
    }),

    removeCourse: (index) => set((state) => {
        // Don't remove if it's the only course
        if (state.preferences.courses.length <= 1) return state;
        return {
            preferences: {
                ...state.preferences,
                courses: state.preferences.courses.filter((_, i) => i !== index)
            }
        };
    }),

    updateCourse: (index, course) => set((state) => {
        const newCourses = [...state.preferences.courses];
        newCourses[index] = course;
        return {
            preferences: {
                ...state.preferences,
                courses: newCourses
            }
        };
    }),

    updateCourseCode: (index, code) => set((state) => {
        const newCourses = [...state.preferences.courses];
        newCourses[index] = { ...newCourses[index], courseCode: code };
        return {
            preferences: {
                ...state.preferences,
                courses: newCourses
            }
        };
    }),

    updatePreferredInstructor: (index, instructor) => set((state) => {
        const newCourses = [...state.preferences.courses];
        newCourses[index] = { ...newCourses[index], preferredInstructor: instructor };
        return {
            preferences: {
                ...state.preferences,
                courses: newCourses
            }
        };
    }),

    updateSectionTypes: (index, sectionTypes) => set((state) => {
        const newCourses = [...state.preferences.courses];
        newCourses[index] = { ...newCourses[index], sectionTypes };
        return {
            preferences: {
                ...state.preferences,
                courses: newCourses
            }
        };
    }),

    // Buffer Time Actions
    updateBufferTime: (bufferTime) => set((state) => ({
        preferences: {
            ...state.preferences,
            bufferTime
        }
    })),

    // Availability Actions
    updateDayAvailability: (day, times) => set((state) => {
        const newAvailability = state.preferences.dailyAvailability.map((dayAvail) =>
            dayAvail.day === day ? { ...dayAvail, availableTimes: times } : dayAvail
        );
        return {
            preferences: {
                ...state.preferences,
                dailyAvailability: newAvailability
            }
        };
    }),

    updateMaxClassesPerDay: (day, max) => set((state) => {
        const newAvailability = state.preferences.dailyAvailability.map((dayAvail) =>
            dayAvail.day === day ? { ...dayAvail, maxClassesPerDay: max } : dayAvail
        );
        return {
            preferences: {
                ...state.preferences,
                dailyAvailability: newAvailability
            }
        };
    }),

    // Schedule Generation
    generateSchedule: async () => {
        set({ isGenerating: true });

        // Mock API call - would be a Supabase Edge Function in production
        try {
            const prefs = get().preferences;
            console.log('Generating schedule with preferences:', prefs);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate response processing
            // In real app, this would send data to a Supabase Edge Function

            console.log('Schedule generated successfully');
        } catch (error) {
            console.error('Failed to generate schedule:', error);
        } finally {
            set({ isGenerating: false });
        }
    }
}));
