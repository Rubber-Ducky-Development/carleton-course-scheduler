export type TermSeason = 'fall' | 'winter';

export type TermLevel = 'undergraduate' | 'graduate';

export interface AcademicTerm {
    season: TermSeason;
    year: 2026 | 2027;
    level: TermLevel;
}

export const DEFAULT_ACADEMIC_TERM: AcademicTerm = {
    season: 'fall',
    year: 2026,
    level: 'undergraduate',
};

export function getAcademicTermKey(term: AcademicTerm) {
    return `${term.season}-${term.year}-${term.level}`;
}

export function getAcademicTermLabel(term: AcademicTerm) {
    return `${term.season === 'fall' ? 'Fall' : 'Winter'} ${term.year} • ${term.level === 'undergraduate' ? 'Undergraduate' : 'Graduate'}`;
}

export type Semester = TermSeason;

export type SectionType = 'Online' | 'Hybrid' | 'In-Person';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export type BufferTime = 'No preference' | '30m' | '1h' | '1h+';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface CoursePreference {
    courseCode: string;
    preferredInstructor: string;
    sectionTypes: SectionType[];
}

export interface ScheduleTime {
    day: string;
    start: string;
    end: string;
    timeOfDay: TimeOfDay;
}

export interface ScheduleCourse {
    courseCode: string;
    title: string;
    instructor: string;
    sectionType: string;
    times: ScheduleTime[];
    meetingDateRanges?: string[];
    matchReason?: string;
    isRequiredSession?: boolean;
    requiredFor?: string;
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
    semester?: TermSeason;
    termYear?: 2026 | 2027;
    level?: TermLevel;
    termCode?: string;
    keyword?: string;
}
