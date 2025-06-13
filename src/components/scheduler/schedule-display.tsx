'use client';

import { Card } from "@/components/ui/card";
import { useScheduleStore } from "@/lib/store/schedule";

export function ScheduleDisplay() {
  const { generatedSchedule, isDemo, message } = useScheduleStore();
  
  if (!generatedSchedule) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Generated Schedule
      </h2>
      
      {isDemo && message && (
        <div className="mb-4 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {message}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {generatedSchedule.map((course, index) => (
          <Card key={index} className="p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {course.courseCode}: {course.title}
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
          </Card>
        ))}
      </div>
    </div>
  );
}
