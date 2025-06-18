'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useScheduleStore } from "@/lib/store/schedule";
import { CalendarView } from './calendar-view';

export function ScheduleDisplay() {
  const { 
    generatedSchedule, 
    alternativeSchedules, 
    isDemo, 
    message,
    currentAlternative,
    setCurrentAlternative,
    getCurrentSchedule 
  } = useScheduleStore();
  
  // Toggle between calendar and list view
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  if (!generatedSchedule) {
    return null;
  }
  
  // Get the current schedule to display (primary or alternative)
  const displaySchedule = getCurrentSchedule();
  
  const hasAlternatives = alternativeSchedules && alternativeSchedules.length > 0;
  
  // Handle alternative selection
  const handleSelectAlternative = (index: number | null) => {
    setCurrentAlternative(index);
  };    return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentAlternative !== null 
              ? `Alternative Schedule #${currentAlternative + 1}` 
              : 'Generated Schedule'}
          </h2>
          
          {/* View mode buttons in a contained button group */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
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
              className={`flex items-center rounded-l-none`}
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
        </div>        {/* Alternative schedule switcher - using Select instead of buttons */}
        {hasAlternatives && (
          <div className="w-full sm:w-60">
            <Select
              label="View Schedule"
              className="w-full"
              value={currentAlternative === null ? 'primary' : currentAlternative.toString()}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'primary') {
                  handleSelectAlternative(null);
                } else {
                  handleSelectAlternative(parseInt(value));
                }
              }}
              options={[
                { value: 'primary', label: 'Primary Schedule' },
                ...alternativeSchedules.map((_, index) => ({
                  value: index.toString(),
                  label: `Alternative ${index + 1}`
                }))
              ]}
            />
          </div>
        )}
      </div>
      
      {isDemo && (
        <div className="mb-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This is a demo schedule. Please enter your courses to get a personalized schedule.
          </p>
        </div>
      )}
      
      {message && (
        <div className="mb-4 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {message}
          </p>
        </div>
      )}      
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <CalendarView courses={displaySchedule} />
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {displaySchedule?.map((course, index) => (
            <Card key={index} className={`p-4 ${course.isRequiredSession ? 'border-l-4 border-blue-500' : ''}`}>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {/* Display just the title, not courseCode: title */}
                {course.title}
                {course.isRequiredSession && (
                  <span className="ml-2 text-sm text-blue-500 font-normal">
                    Required for {course.requiredFor}
                  </span>
                )}
              </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instructor: {course.instructor}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Section Type: {course.sectionType}
            </p>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Schedule:
              </p>
              <ul className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {course.times.map((time, timeIndex) => (
                  <li key={timeIndex}>
                    {time.day}: {time.start} - {time.end} ({time.timeOfDay})
                  </li>
                ))}
              </ul>
            </div>
            
            {/* For backward compatibility with old nested format */}
            {course.requiredSessions && course.requiredSessions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Required tutorials/labs:
                </p>
                <div className="mt-2 space-y-2">
                  {course.requiredSessions.map((requiredSession, rIndex) => (
                    <div key={rIndex} className="bg-gray-50 dark:bg-gray-800 rounded-md p-2">
                      <p className="text-sm font-medium">{requiredSession.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Type: {requiredSession.sectionType} | Instructor: {requiredSession.instructor}
                      </p>
                      <ul className="mt-1 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        {requiredSession.times.map((time, timeIndex) => (
                          <li key={timeIndex}>
                            {time.day}: {time.start} - {time.end} ({time.timeOfDay})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {course.matchReason && currentAlternative !== null && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
                <p>Reason: {course.matchReason}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
      )}
      
      {hasAlternatives && currentAlternative === null && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            We've generated {alternativeSchedules.length} alternative schedule{alternativeSchedules.length > 1 ? 's' : ''} that might suit your preferences.
            Click the buttons above to explore them.
          </p>
        </div>
      )}
    </div>
  );
}
