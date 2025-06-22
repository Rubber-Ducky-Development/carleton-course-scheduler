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
import { toast } from 'react-hot-toast';

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
    
    // Reset Preferences
    resetPreferences: () => void;
    resetAvailabilityPreferences: () => void;

    // Schedule Generation
    generateSchedule: () => Promise<void>;
    isGenerating: boolean;
}

// Initialize with default preferences
const initialPreferences: SchedulerPreferences = {
    courses: [{ courseCode: '', preferredInstructor: '', sectionTypes: [] }],
    bufferTime: 'No preference',      dailyAvailability: [
        { day: 'Monday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Tuesday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Wednesday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Thursday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Friday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
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
    
    // Reset availability preferences only (keeps course preferences intact)
    resetAvailabilityPreferences: () => {
        // Clear any existing schedule
        useScheduleStore.getState().clearSchedule();
        
        // Reset just the availability and buffer time settings
        set((state) => ({
            preferences: {
                ...state.preferences,
                bufferTime: initialPreferences.bufferTime,
                dailyAvailability: JSON.parse(JSON.stringify(initialPreferences.dailyAvailability))
            }
        }));
    },
    
    // Reset all preferences to default values
    resetPreferences: () => {
        // Clear any existing schedule
        useScheduleStore.getState().clearSchedule();
        
        // Reset preferences to initial defaults
        set({ 
            preferences: JSON.parse(JSON.stringify(initialPreferences))
        });    },
    // Schedule Generation
    generateSchedule: async () => {
        const prefs = get().preferences;
        
        // Check if any courses have been entered
        const hasValidCourses = prefs.courses.some(course => course.courseCode?.trim().length > 0);
        
        if (!hasValidCourses) {
            // Import dynamically to avoid SSR issues
            toast.error("Please enter at least one course before generating a schedule.");
            return;
        }
          // Check for empty course cards
        const hasEmptyCourses = prefs.courses.some(course => !course.courseCode?.trim());
        
        if (hasEmptyCourses) {
            toast.error("Please enter a course code for all course cards or remove empty ones.");
            return;
        }
        
        set({ isGenerating: true });        try {
            // First, validate courses exist before sending to the Edge Function
            const validateUrl = '/api/validate-courses';
            
            const validationResult = await fetch(validateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courses: prefs.courses }),
            });
              if (!validationResult.ok) {
                const errorData = await validationResult.json();
                toast.error(errorData.error || "Failed to validate courses");
                set({ isGenerating: false });
                return;
            }
              const validation = await validationResult.json();
            
            if (validation.invalidCourses && validation.invalidCourses.length > 0) {
                toast.error(validation.message || `The following courses were not found: ${validation.invalidCourses.join(', ')}`);
                set({ isGenerating: false });
                return;
            }
              // Proceed with schedule generation if validation passes
            const apiUrl = '/api/generate-schedule';
            
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
              const response = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(prefs),
            });
            
            if (!response.ok) {
                const errorText = await response.text();                throw new Error(`Error ${response.status}: ${errorText}`);
            }            const result = await response.json();
            // Update the schedule store with the generated schedule and alternatives
            useScheduleStore.getState().setSchedule(
              result.courses,
              result.alternativeSchedules || null,
              !!result.demo,
              result.message || null
            );// Log the primary schedule courses            // Course mapping is done directly in the setSchedule method
              // Show success toast with hint about viewing more details
            toast.success(
                window.innerWidth <= 768 
                ? "Schedule generated! Tap on courses in the calendar to see more details." 
                : "Schedule generated! Hover over courses in the calendar to see more details."
            );
              // Alternative schedules handled by setSchedule method
            }catch (error) {
            console.error('Failed to generate schedule:', error);
            
            // Show error toast
            toast.error("Failed to generate schedule. Please try again.");
        } finally {
            set({ isGenerating: false });
        }
    }
}));
