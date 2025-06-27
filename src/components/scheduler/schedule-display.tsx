'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useScheduleStore } from "@/lib/store/schedule";
import { CalendarView } from './calendar-view';

export function ScheduleDisplay() {  
  const { 
    schedules,
    currentSemester,
    setCurrentAlternative,
    getCurrentSchedule 
  } = useScheduleStore();
  
  const currentScheduleData = schedules[currentSemester];
  const { 
    generatedSchedule, 
    alternativeSchedules, 
    isDemo, 
    message,
    currentAlternative
  } = currentScheduleData;
  
  // Toggle between calendar and list view
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // Detect mobile device for appropriate instructions
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  if (!generatedSchedule) {
    return null;
  }
  
  // Get the current schedule to display (primary or alternative)
  const displaySchedule = getCurrentSchedule();
  
  const hasAlternatives = alternativeSchedules && alternativeSchedules.length > 0;
  
  // Handle alternative selection
  const handleSelectAlternative = (index: number | null) => {
    setCurrentAlternative(index);
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">        <div className="flex flex-col items-start gap-2">          <h2 className="text-xl font-semibold text-indigo-800">
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
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-1">
            {/* On desktop: Previous - Select - Next */}
            {/* On mobile: Select menu on top, Previous & Next buttons below */}
            
            {/* Previous button - hidden on mobile, visible on desktop */}
            <Button 
              variant="secondary" 
              size="sm"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-md shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors mr-2"
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
            
            {/* Select menu for alternatives */}
            <div className="w-full sm:w-48 mb-2 sm:mb-0 sm:mx-0">
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
            
            {/* Next button - hidden on mobile, visible on desktop */}
            <Button 
              variant="secondary" 
              size="sm"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-md shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors ml-2"
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
            
            {/* Mobile only buttons - horizontal layout below select menu */}
            <div className="flex sm:hidden flex-row justify-center w-full space-x-4 mt-1">
              {/* Mobile Previous button */}
              <Button 
                variant="secondary" 
                size="sm"
                className="flex items-center justify-center w-10 h-10 rounded-md shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
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
              
              {/* Mobile Next button */}
              <Button 
                variant="secondary" 
                size="sm"
                className="flex items-center justify-center w-10 h-10 rounded-md shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
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
        <div className="mb-4 rounded-xl bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-3 border border-indigo-100 shadow-sm">
          <p className="text-sm text-indigo-700">
            This is a demo schedule. Please enter your courses to get a personalized schedule.
          </p>
        </div>
      )}      {message && (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-3 border border-indigo-100 shadow-sm">
          <p className="text-sm text-indigo-700 flex flex-wrap items-center justify-between gap-2">
            <span>{message}</span>
            <span className="text-xs">
              {isMobile 
                ? "Tap on courses to see details" 
                : "Hover over courses to see details"}
            </span>
          </p>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && displaySchedule && (
        <div className="mt-4">
          <CalendarView courses={displaySchedule} />
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && displaySchedule && (
        <div className="mt-4 space-y-3">
          {displaySchedule.map((course, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="border-l-4" style={{ borderColor: stringToColor(course.courseCode) }}>
                <div className="p-4">                  <h3 className="font-semibold text-lg text-gray-900">
                    {course.courseCode}: {course.title.startsWith(course.courseCode) ? 
                      course.title.substring(course.courseCode.length).trim().replace(/^:?\s*/, '') : 
                      course.title}
                  </h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <div>
                      <span className="text-indigo-600 font-medium">Instructor: </span>
                      {course.instructor || 'No instructor listed'}
                    </div>
                    <div>
                      <span className="text-indigo-600 font-medium">Type: </span>
                      {course.sectionType || 'No type listed'}
                    </div>                    <div>
                      <span className="text-indigo-600 font-medium">Schedule: </span>
                      {course.times.map((time, idx) => (
                        <span key={idx}>
                          {idx > 0 && ", "}
                          {time.day} {time.start} - {time.end}
                        </span>
                      ))}
                    </div>
                    <div>
                      <span className="text-indigo-600 font-medium">Time of Day: </span>
                      {course.times.map(t => t.timeOfDay).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-indigo-600 font-medium">Match Reason: </span>
                      {course.matchReason || 'Primary selection'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}      {hasAlternatives && (
        <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">          
          <p className="text-sm text-indigo-700">
            We&apos;ve generated {alternativeSchedules.length} alternative schedule{alternativeSchedules.length > 1 ? 's' : ''} that might suit your preferences.<br></br>Calendar view may not always show all courses, especially online unscheduled ones. Switch to list view to view all courses.
          </p>
        </div>
      )}
    </div>
  );
}

function stringToColor(str: string) {
  // Extract the main course code without section parts (e.g., "MATH1007" from "MATH1007A")
  const coursePrefix = str.match(/^[A-Z]+\d+/)?.[0] || str;
  
  // Create a hash of the course prefix
  let hash = 0;
  for (let i = 0; i < coursePrefix.length; i++) {
    hash = coursePrefix.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Define a palette of distinct, accessible colors
  const colorPalette = [
    '#3182ce', // Blue
    '#e53e3e', // Red
    '#38a169', // Green
    '#805ad5', // Purple
    '#dd6b20', // Orange
    '#319795', // Teal
    '#d53f8c', // Pink
    '#718096', // Gray
    '#d69e2e', // Yellow
    '#2c5282', // Dark Blue
    '#9f7aea', // Light Purple
    '#f56565', // Light Red
    '#48bb78', // Light Green
    '#ed8936', // Light Orange
    '#0694a2', // Cyan
    '#6b46c1'  // Violet
  ];
  
  // Use the hash to select a color from the palette
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}
