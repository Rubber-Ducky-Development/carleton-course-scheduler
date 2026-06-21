'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useScheduleStore } from "@/lib/store/schedule";
import { CalendarView } from './calendar-view';

const calendarDayLookup: Record<string, string> = {
  sun: 'Sunday',
  sunday: 'Sunday',
  su: 'Sunday',
  u: 'Sunday',
  mon: 'Monday',
  monday: 'Monday',
  tue: 'Tuesday',
  tues: 'Tuesday',
  tuesday: 'Tuesday',
  tu: 'Tuesday',
  t: 'Tuesday',
  wed: 'Wednesday',
  wednesday: 'Wednesday',
  w: 'Wednesday',
  thu: 'Thursday',
  thur: 'Thursday',
  thurs: 'Thursday',
  thursday: 'Thursday',
  th: 'Thursday',
  r: 'Thursday',
  h: 'Thursday',
  fri: 'Friday',
  friday: 'Friday',
  f: 'Friday',
  sat: 'Saturday',
  saturday: 'Saturday',
  s: 'Saturday',
};

const calendarDays = new Set(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
const calendarDayStartInMinutes = 8 * 60;
const calendarDayEndInMinutes = 22 * 60 + 30;

function normalizeCalendarDay(day: string): string {
  const token = day.trim().toLowerCase();
  return calendarDayLookup[token] ?? day.trim();
}

function parseClockTimeToMinutes(timeStr: string): number | null {
  const clean = timeStr.trim();
  const [time, period] = clean.split(' ');

  if (!time || !period) return null;

  const [hoursPart, minutesPart] = time.split(':');
  const hours = Number.parseInt(hoursPart, 10);
  const minutes = Number.parseInt(minutesPart, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (period !== 'AM' && period !== 'PM') return null;

  let normalizedHours = hours;
  if (period === 'PM' && normalizedHours !== 12) normalizedHours += 12;
  if (period === 'AM' && normalizedHours === 12) normalizedHours = 0;

  return normalizedHours * 60 + minutes;
}

function isCourseVisibleInCalendar(course: { times: { day: string; start: string; end: string }[] }): boolean {
  return course.times.some((time) => {
    const normalizedDay = normalizeCalendarDay(time.day);
    if (!calendarDays.has(normalizedDay)) return false;

    const startMinutes = parseClockTimeToMinutes(time.start);
    const endMinutes = parseClockTimeToMinutes(time.end);
    if (startMinutes === null || endMinutes === null) return false;
    if (endMinutes <= startMinutes) return false;

    const clampedStart = Math.max(startMinutes, calendarDayStartInMinutes);
    const clampedEnd = Math.min(endMinutes, calendarDayEndInMinutes);
    return clampedEnd > clampedStart;
  });
}

export function ScheduleDisplay() {
  const {
    schedules,
    currentSemester,
    setCurrentAlternative,
    getCurrentSchedule,
  } = useScheduleStore();

  const currentScheduleData = schedules[currentSemester];
  const {
    generatedSchedule,
    alternativeSchedules,
    isDemo,
    message,
    currentAlternative,
  } = currentScheduleData;

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!generatedSchedule) {
    return null;
  }

  const displaySchedule = getCurrentSchedule();
  const hasAlternatives = Boolean(alternativeSchedules && alternativeSchedules.length > 0);
  const nonCalendarCourses = (displaySchedule ?? []).filter((course) => !isCourseVisibleInCalendar(course));

  const handleSelectAlternative = (index: number | null) => {
    setCurrentAlternative(index);
  };

  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-xl font-semibold text-indigo-800">
            {currentAlternative !== null ? `Alternative Schedule #${currentAlternative + 1}` : 'Generated Schedule'}
          </h2>

          {hasAlternatives && alternativeSchedules && (
            <div className="w-full rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
              <p className="text-sm text-indigo-700">
                We&apos;ve generated {alternativeSchedules.length} alternative schedule{alternativeSchedules.length > 1 ? 's' : ''} that might suit your preferences.
                <br></br>
                Calendar view may not always show all courses. Switch to list view to view all courses.
              </p>
            </div>
          )}

          {viewMode === 'calendar' && nonCalendarCourses.length > 0 && (
            <div className="w-full rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                Some courses cannot be displayed in Calendar view (for example online, unknown, or unscheduled sections). Details available in List view:
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-900 dark:text-amber-100">
                {nonCalendarCourses.map((course) => (
                  <li key={`${course.courseCode}-${course.title}`}>{course.courseCode}: {course.title}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="inline-flex rounded-lg bg-gray-50 p-1 shadow-sm" role="group">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center rounded-r-none ${viewMode === 'calendar' ? 'border-r-0' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center rounded-l-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              List
            </Button>
          </div>
        </div>

        {hasAlternatives && alternativeSchedules && (
          <div className="flex w-full flex-col items-center gap-1 sm:w-auto sm:flex-row">
            <Button
              variant="secondary"
              size="sm"
              className="mr-2 hidden h-10 w-10 items-center justify-center rounded-md shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:flex"
              onClick={() => {
                if (currentAlternative === null) {
                  handleSelectAlternative(alternativeSchedules.length - 1);
                } else if (currentAlternative === 0) {
                  handleSelectAlternative(null);
                } else {
                  handleSelectAlternative(currentAlternative - 1);
                }
              }}
              title="Previous Schedule"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Button>

            <div className="mb-2 w-full sm:mx-0 sm:mb-0 sm:w-48">
              <Select
                label="View Schedule"
                className="w-full"
                value={currentAlternative === null ? 'primary' : currentAlternative.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  handleSelectAlternative(value === 'primary' ? null : parseInt(value));
                }}
                options={[
                  { value: 'primary', label: 'Primary Schedule' },
                  ...alternativeSchedules.map((_, index) => ({
                    value: index.toString(),
                    label: `Alternative ${index + 1}`,
                  })),
                ]}
              />
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="ml-2 hidden h-10 w-10 items-center justify-center rounded-md shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:flex"
              onClick={() => {
                if (currentAlternative === null) {
                  handleSelectAlternative(0);
                } else if (currentAlternative === alternativeSchedules.length - 1) {
                  handleSelectAlternative(null);
                } else {
                  handleSelectAlternative(currentAlternative + 1);
                }
              }}
              title="Next Schedule"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>

            <div className="mt-1 flex w-full flex-row justify-center space-x-4 sm:hidden">
              <Button
                variant="secondary"
                size="sm"
                className="flex h-10 w-10 items-center justify-center rounded-md shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                onClick={() => {
                  if (currentAlternative === null) {
                    handleSelectAlternative(alternativeSchedules.length - 1);
                  } else if (currentAlternative === 0) {
                    handleSelectAlternative(null);
                  } else {
                    handleSelectAlternative(currentAlternative - 1);
                  }
                }}
                title="Previous Schedule"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="flex h-10 w-10 items-center justify-center rounded-md shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                onClick={() => {
                  if (currentAlternative === null) {
                    handleSelectAlternative(0);
                  } else if (currentAlternative === alternativeSchedules.length - 1) {
                    handleSelectAlternative(null);
                  } else {
                    handleSelectAlternative(currentAlternative + 1);
                  }
                }}
                title="Next Schedule"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>

      {isDemo && (
        <div className="mb-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-3 shadow-sm">
          <p className="text-sm text-indigo-700">This is a demo schedule. Please enter your courses to get a personalized schedule.</p>
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-3 shadow-sm">
          <p className="flex flex-wrap items-center justify-between gap-2 text-sm text-indigo-700">
            <span>{message}</span>
            <span className="text-xs">{isMobile ? 'Tap on courses to see details' : 'Hover over courses to see details'}</span>
          </p>
        </div>
      )}

      {viewMode === 'calendar' && displaySchedule && (
        <div className="mt-4">
          <CalendarView courses={displaySchedule} />
        </div>
      )}

      {viewMode === 'list' && displaySchedule && (
        <div className="mt-4 space-y-3">
          {displaySchedule.map((course, index) => (
            <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="border-l-4" style={{ borderColor: stringToColor(course.courseCode) }}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.courseCode}: {course.title.startsWith(course.courseCode)
                        ? course.title.substring(course.courseCode.length).trim().replace(/^:?\s*/, '')
                        : course.title}
                    </h3>
                    {course.requiredFor && course.isRequiredSession && (
                      <span className="shrink-0 rounded-full border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                        Required for {course.requiredFor}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-sm md:grid-cols-2">
                    <div>
                      <span className="font-medium text-indigo-600">Instructor: </span>
                      {course.instructor
                        ? (['yes', 'no'].includes(course.instructor.trim().toLowerCase()) ? 'TBD' : course.instructor)
                        : 'No instructor listed'}
                    </div>
                    <div>
                      <span className="font-medium text-indigo-600">Type: </span>
                      {course.sectionType || 'No type listed'}
                    </div>
                    <div>
                      <span className="font-medium text-indigo-600">Schedule: </span>
                      {course.times.length > 0
                        ? course.times.map((time, idx) => (
                          <span key={idx}>
                            {idx > 0 && ', '}
                            {time.day} {time.start} - {time.end}
                          </span>
                        ))
                        : 'Unscheduled/TBA'}
                    </div>
                    <div>
                      <span className="font-medium text-indigo-600">Time of Day: </span>
                      {course.times.length > 0
                        ? course.times.map((t) => t.timeOfDay).filter((v, i, a) => a.indexOf(v) === i).join(', ')
                        : 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium text-indigo-600">Meeting Dates: </span>
                      {course.meetingDateRanges && course.meetingDateRanges.length > 0
                        ? course.meetingDateRanges.join(', ')
                        : 'Not listed'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-indigo-600">Match Reason: </span>
                      {course.matchReason || 'Primary selection'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}

function stringToColor(str: string) {
  const coursePrefix = str.match(/^[A-Z]+\d+/)?.[0] || str;

  let hash = 0;
  for (let i = 0; i < coursePrefix.length; i++) {
    hash = coursePrefix.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorPalette = [
    '#3182ce',
    '#e53e3e',
    '#38a169',
    '#805ad5',
    '#dd6b20',
    '#319795',
    '#d53f8c',
    '#718096',
    '#d69e2e',
    '#2c5282',
    '#9f7aea',
    '#f56565',
    '#48bb78',
    '#ed8936',
    '#0694a2',
    '#6b46c1',
  ];

  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}
