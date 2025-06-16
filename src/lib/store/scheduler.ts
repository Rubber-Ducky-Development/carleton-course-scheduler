import { create } from 'zustand';
import {
    BufferTime,
    CoursePreference,
    DayOfWeek,
    SchedulerPreferences,
    SectionType,
    TimeOfDay
} from '../types/scheduler';
import { useScheduleStore } from './schedule';

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
    }),    // Schedule Generation
    generateSchedule: async () => {
        set({ isGenerating: true });

        try {
            const prefs = get().preferences;
            console.log('Generating schedule with preferences:', prefs);

            // We'll use our API endpoint that forwards the request to the Supabase Edge Function
            // This way we don't have to deal with CORS issues on the client
            const apiUrl = '/api/generate-schedule';
            console.log('Using API URL:', apiUrl);
            
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            
            console.log('Making API call with headers:', headers);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(prefs),
            });
            
            console.log('API response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }            const result = await response.json();
            console.log('Schedule generated successfully:', result);
            
            // Update the schedule store with the generated schedule and alternatives
            useScheduleStore.getState().setSchedule(
              result.courses,
              result.alternativeSchedules || null,
              !!result.demo,
              result.message || null
            );
            
            // Log the primary schedule courses
            const coursesList = result.courses.map((c: any) => 
                `${c.courseCode}: ${c.title} with ${c.instructor} (${c.sectionType})`
            ).join('\n');
            
            console.log('Generated schedule courses:\n', coursesList);
            
            // Log alternative schedules if they exist
            if (result.alternativeSchedules && result.alternativeSchedules.length > 0) {
                console.log(`Found ${result.alternativeSchedules.length} alternative schedules`);
            }

        } catch (error) {
            console.error('Failed to generate schedule:', error);
        } finally {
            set({ isGenerating: false });
        }
    }
}));
