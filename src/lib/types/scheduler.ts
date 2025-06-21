export type SectionType = 'Online' | 'Hybrid' | 'In-Person';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export type BufferTime = 'No preference' | '30m' | '1h' | '1h+';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface CoursePreference {
    courseCode: string;
    preferredInstructor: string;
    sectionTypes: SectionType[];
}

export interface DailyAvailability {
    day: DayOfWeek;
    availableTimes: TimeOfDay[];
    maxClassesPerDay: number;
}

export interface SchedulerPreferences {
    courses: CoursePreference[];
    bufferTime: BufferTime;
    dailyAvailability: DailyAvailability[];
}
