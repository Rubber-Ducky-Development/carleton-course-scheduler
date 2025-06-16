'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/lib/store/schedule";

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
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentAlternative !== null 
            ? `Alternative Schedule #${currentAlternative + 1}` 
            : 'Generated Schedule'}
        </h2>
        
        {/* Alternative schedule switcher */}
        {hasAlternatives && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className={!currentAlternative ? 'bg-primary-100 dark:bg-primary-900' : ''}
              onClick={() => handleSelectAlternative(null)}
            >
              Primary
            </Button>
            
            {alternativeSchedules.map((_, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={currentAlternative === index ? 'bg-primary-100 dark:bg-primary-900' : ''}
                onClick={() => handleSelectAlternative(index)}
              >
                {index + 1}
              </Button>
            ))}
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
