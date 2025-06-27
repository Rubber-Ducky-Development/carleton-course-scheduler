import { create } from 'zustand';
import {
    BufferTime,
    CoursePreference,
    DayOfWeek,
    SchedulerPreferences,
    SectionType,
    TimeOfDay,
    Semester
} from '../types/scheduler';
import { useScheduleStore } from './schedule';
import { toast } from 'react-hot-toast';

interface SchedulerState {
    currentSemester: Semester;
    preferences: {
        fall: SchedulerPreferences;
        winter: SchedulerPreferences;
    };

    // Semester Actions
    switchSemester: (semester: Semester) => void;
    getCurrentPreferences: () => SchedulerPreferences;

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
    bufferTime: 'No preference', dailyAvailability: [
        { day: 'Monday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Tuesday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Wednesday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Thursday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
        { day: 'Friday', availableTimes: ['Morning', 'Afternoon', 'Evening'], maxClassesPerDay: 7 },
    ],
};

export const useSchedulerStore = create<SchedulerState>((set, get) => ({
    currentSemester: 'fall',
    preferences: {
        fall: initialPreferences,
        winter: JSON.parse(JSON.stringify(initialPreferences))
    },
    isGenerating: false,

    // Semester Actions
    switchSemester: (semester: Semester) => set({ currentSemester: semester }),

    getCurrentPreferences: () => {
        const state = get();
        return state.preferences[state.currentSemester];
    },

    // Course Actions
    addCourse: () => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        // Only allow up to 7 courses
        if (currentPrefs.courses.length >= 7) return state;
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    courses: [
                        ...currentPrefs.courses,
                        { courseCode: '', preferredInstructor: '', sectionTypes: [] }
                    ]
                }
            }
        };
    }),

    removeCourse: (index) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        // Don't remove if it's the only course
        if (currentPrefs.courses.length <= 1) return state;
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    courses: currentPrefs.courses.filter((_, i) => i !== index)
                }
            }
        };
    }),

    updateCourse: (index, course) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        const newCourses = [...currentPrefs.courses];
        newCourses[index] = course;
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    courses: newCourses
                }
            }
        };
    }),

    updateCourseCode: (index, code) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        const newCourses = [...currentPrefs.courses];
        newCourses[index] = { ...newCourses[index], courseCode: code };
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    courses: newCourses
                }
            }
        };
    }),

    updatePreferredInstructor: (index, instructor) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        const newCourses = [...currentPrefs.courses];
        newCourses[index] = { ...newCourses[index], preferredInstructor: instructor };
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    courses: newCourses
                }
            }
        };
    }),

    updateSectionTypes: (index, sectionTypes) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        const newCourses = [...currentPrefs.courses];
        newCourses[index] = { ...newCourses[index], sectionTypes };
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    courses: newCourses
                }
            }
        };
    }),

    // Buffer Time Actions
    updateBufferTime: (bufferTime) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    bufferTime
                }
            }
        };
    }),

    // Availability Actions
    updateDayAvailability: (day, times) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        const newAvailability = currentPrefs.dailyAvailability.map((dayAvail) =>
            dayAvail.day === day ? { ...dayAvail, availableTimes: times } : dayAvail
        );
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    dailyAvailability: newAvailability
                }
            }
        };
    }),

    updateMaxClassesPerDay: (day, max) => set((state) => {
        const currentPrefs = state.preferences[state.currentSemester];
        const newAvailability = currentPrefs.dailyAvailability.map((dayAvail) =>
            dayAvail.day === day ? { ...dayAvail, maxClassesPerDay: max } : dayAvail
        );
        return {
            preferences: {
                ...state.preferences,
                [state.currentSemester]: {
                    ...currentPrefs,
                    dailyAvailability: newAvailability
                }
            }
        };
    }),

    // Reset availability preferences only (keeps course preferences intact)
    resetAvailabilityPreferences: () => {
        // Clear any existing schedule
        useScheduleStore.getState().clearSchedule();

        // Reset just the availability and buffer time settings for current semester
        set((state) => {
            const currentPrefs = state.preferences[state.currentSemester];
            return {
                preferences: {
                    ...state.preferences,
                    [state.currentSemester]: {
                        ...currentPrefs,
                        bufferTime: initialPreferences.bufferTime,
                        dailyAvailability: JSON.parse(JSON.stringify(initialPreferences.dailyAvailability))
                    }
                }
            };
        });
    },

    // Reset all preferences to default values for current semester
    resetPreferences: () => {
        // Clear any existing schedule
        useScheduleStore.getState().clearSchedule();

        // Reset preferences to initial defaults for current semester
        set((state) => ({
            preferences: {
                ...state.preferences,
                [state.currentSemester]: JSON.parse(JSON.stringify(initialPreferences))
            }
        }));
    },
    // Schedule Generation
    generateSchedule: async () => {
        const prefs = get().getCurrentPreferences();

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

        set({ isGenerating: true }); try {
            // First, validate courses exist before sending to the Edge Function
            const validateUrl = '/api/validate-courses';

            const validationResult = await fetch(validateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Term': get().currentSemester // Pass current semester
                },
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
                'Content-Type': 'application/json',
                'X-Term': get().currentSemester // Pass current semester
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(prefs),
            });

            if (!response.ok) {
                const errorText = await response.text(); throw new Error(`Error ${response.status}: ${errorText}`);
            } const result = await response.json();
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
        } catch (error) {
            console.error('Failed to generate schedule:', error);

            // Show error toast
            toast.error("Failed to generate schedule. Please try again.");
        } finally {
            set({ isGenerating: false });
        }
    }
}));
