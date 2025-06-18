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
  };    return (    <div className="mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">          <h2 className="text-xl font-semibold text-indigo-800">
            {currentAlternative !== null 
              ? `Alternative Schedule #${currentAlternative + 1}` 
              : 'Generated Schedule'}
          </h2>
          
          {/* View mode buttons in a contained button group */}
          <div className="inline-flex rounded-lg shadow-sm bg-gray-50 p-1" role="group">
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
        </div>        {/* Alternative schedule switcher and navigation */}
        {hasAlternatives && (
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            {/* Select menu for alternatives */}
            <div className="w-full sm:w-48">
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
            
            {/* Navigation buttons */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Button 
                variant="secondary" 
                size="sm"
                className="flex items-center justify-center w-10 h-10 rounded-md shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                onClick={() => {
                  // Navigate to previous schedule
                  if (currentAlternative === null) {
                    // If on primary, go to the last alternative
                    handleSelectAlternative(alternativeSchedules.length - 1);
                  } else if (currentAlternative === 0) {
                    // If on first alternative, go to primary
                    handleSelectAlternative(null);
                  } else {
                    // Go to previous alternative
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
                className="flex items-center justify-center w-10 h-10 rounded-md shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                onClick={() => {
                  // Navigate to next schedule
                  if (currentAlternative === null) {
                    // If on primary, go to the first alternative
                    handleSelectAlternative(0);
                  } else if (currentAlternative === alternativeSchedules.length - 1) {
                    // If on last alternative, go to primary
                    handleSelectAlternative(null);
                  } else {
                    // Go to next alternative
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
      </div>      {isDemo && (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-3 border border-indigo-100 shadow-sm">
          <p className="text-sm text-indigo-700">
            This is a demo schedule. Please enter your courses to get a personalized schedule.
          </p>
        </div>
      )}
      
      {message && (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-yellow-50/80 p-3 border border-amber-100 shadow-sm">
          <p className="text-sm text-amber-700">
            {message}
          </p>
        </div>
      )}
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <CalendarView courses={displaySchedule} />
      )}        {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-5">          {displaySchedule?.map((course, index) => (
            <Card key={index} className={`p-3 ${course.isRequiredSession ? 'border-l-4 border-indigo-500 purple-highlight' : ''}`}>
              <h3 className="text-base font-medium text-gray-900">
                {/* Display just the title, not courseCode: title */}
                {course.title}
                {course.isRequiredSession && (
                  <span className="ml-2 text-sm text-indigo-600 font-normal">
                    Required for {course.requiredFor}
                  </span>
                )}
              </h3>
            <div className="flex flex-wrap gap-x-6 mt-1">
              <p className="text-sm text-gray-700 list-item-text">
                <span className="font-medium">Instructor:</span> {course.instructor}
              </p>
              <p className="text-sm text-gray-700 list-item-text">
                <span className="font-medium">Section Type:</span> {course.sectionType}
              </p>
            </div>
            <div className="mt-1.5">
              <p className="text-sm font-medium text-gray-800">
                Schedule:
              </p>
              <ul className="mt-0.5 space-y-0.5 text-sm text-gray-700 list-item-text">
                {course.times.map((time, timeIndex) => (
                  <li key={timeIndex}>
                    {time.day}: {time.start} - {time.end} ({time.timeOfDay})
                  </li>
                ))}
              </ul>
            </div>
            
            {/* For backward compatibility with old nested format */}
            {course.requiredSessions && course.requiredSessions.length > 0 && (              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-800">
                  Required tutorials/labs:
                </p>
                <div className="mt-2 space-y-2">
                  {course.requiredSessions.map((requiredSession, rIndex) => (                    <div key={rIndex} className="bg-indigo-50 rounded-md p-2 border-l-2 border-indigo-300">
                      <p className="text-sm font-medium text-indigo-800">{requiredSession.title}</p>
                      <p className="text-xs text-gray-700">
                        Type: {requiredSession.sectionType} | Instructor: {requiredSession.instructor}
                      </p>
                      <ul className="mt-1 space-y-1 text-xs text-gray-700">
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
            {course.matchReason && currentAlternative !== null && (              <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                <p>Reason: {course.matchReason}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
      )}
      
      {hasAlternatives && currentAlternative === null && (        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">
            We've generated {alternativeSchedules.length} alternative schedule{alternativeSchedules.length > 1 ? 's' : ''} that might suit your preferences.
            Use the navigation buttons above to explore them.
          </p>
        </div>
      )}
    </div>
  );
}
