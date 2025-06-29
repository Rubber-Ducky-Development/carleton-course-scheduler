'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ScheduleCourse } from '@/lib/store/schedule';

// Generate a consistent color based on a string (course code)
function stringToColor(str: string) {
  // Extract the main course code without section parts (e.g., "MATH1007" from "MATH1007A")
  const coursePrefix = str.match(/^[A-Z]+\d+/)?.[0] || str;
  
  // Create a hash of the course prefix
  let hash = 0;
  for (let i = 0; i < coursePrefix.length; i++) {
    hash = coursePrefix.charCodeAt(i) + ((hash << 5) - hash);
  }  // Academic-focused color palette with professional, distinct hues - slightly brightened
  const colorPalette = [
    '#3182ce', // Blue
    '#e53e3e', // Red
    '#38a169', // Green
    '#805ad5', // Purple
    '#dd6b20', // Orange
    '#319795', // TealAdd commentMore actions
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

// Custom tooltip component for course events
const EventTooltip = ({ 
  event, 
  visible, 
  position 
}: { 
  event: CalendarEvent, 
  visible: boolean, 
  position: { x: number, y: number } 
}) => {
  // Always declare hooks at the top level
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Calculate if tooltip would go off the bottom of the viewport
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
    top: `${position.y + 10}px`,
    left: `${position.x + 10}px`,
  });
    // Use effect to check and adjust tooltip position after render
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const calendarRect = tooltipRef.current.closest('.calendar-container')?.getBoundingClientRect() || {
        top: 0,
        bottom: viewportHeight,
        left: 0,
        right: viewportWidth
      };
      
      // Get available space in different directions
      const spaceBelow = viewportHeight - position.y;
      const spaceAbove = position.y - calendarRect.top;
      const spaceRight = viewportWidth - position.x;
      const spaceLeft = position.x - calendarRect.left;
      
      // Default positions
      let topPos = position.y + 10;
      let leftPos = position.x + 10;
      
      // Adjust vertical position
      if (spaceBelow < rect.height + 20 && spaceAbove > rect.height + 20) {
        // Not enough space below but enough above - show above
        topPos = position.y - rect.height - 10;
      } else if (spaceBelow < rect.height + 20) {
        // Not enough space below or above - center as much as possible
        topPos = Math.max(calendarRect.top + 5, viewportHeight - rect.height - 5 - calendarRect.top);
      }
      
      // Adjust horizontal position
      if (spaceRight < rect.width + 20 && spaceLeft > rect.width + 20) {
        // Not enough space right but enough left - show to the left
        leftPos = position.x - rect.width - 10;
      } else if (spaceRight < rect.width + 20) {
        // Not enough space right or left - center as much as possible
        leftPos = Math.max(calendarRect.left + 5, viewportWidth - rect.width - 5);
      }
      
      setTooltipStyle({
        top: `${topPos}px`,
        left: `${leftPos}px`,
        maxHeight: `${viewportHeight - 20}px`,
        overflowY: 'auto'
      });
    }
  }, [position, visible]);
    if (!visible) return null;
  
  return (
    <div 
      ref={tooltipRef}
      className="absolute z-50 bg-black bg-opacity-90 text-white rounded p-3 shadow-lg text-xs max-w-xs"
      style={tooltipStyle}    ><div className="tracking-wide text-sm">{event.courseCode}</div>
      <div className="font-medium mt-1">{event.title.replace(`${event.courseCode}: `, '')}</div>
      <div className="mt-1 text-yellow-300 text-xs font-semibold">
        {/* Format the time display using military and regular time */}
        {`${event.startHour % 12 || 12}:${event.startMinute.toString().padStart(2, '0')} ${event.startHour >= 12 ? 'PM' : 'AM'} - ${event.endHour % 12 || 12}:${event.endMinute.toString().padStart(2, '0')} ${event.endHour >= 12 ? 'PM' : 'AM'}`}
      </div>
      <div className="mt-2 text-gray-300">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full mr-1" 
            style={{ backgroundColor: stringToColor(event.isRequiredSession && event.requiredFor ? event.requiredFor : event.courseCode) }} 
          />
          <span>
            {event.sectionType}
            {event.isRequiredSession && " (Tutorial/Lab)"}
          </span>
        </div>
        <div className="mt-1">Instructor: {event.instructor}</div>
        {event.isRequiredSession && (
          <div className="text-blue-300 mt-2 border-t border-gray-700 pt-1">
            Associated with: <span className="font-medium">{event.requiredFor}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Convert time string (e.g., "8:30 AM") to hours and minutes
const parseTimeString = (timeStr: string) => {
  // Handle any whitespace issues in the time string
  const cleanTimeStr = timeStr.trim();
  const [time, period] = cleanTimeStr.split(' ');
  let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
  
  // Ensure we have valid numbers
  hours = isNaN(hours) ? 0 : hours;
  minutes = isNaN(minutes) ? 0 : minutes;
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
};

// Day mapping from strings to numbers for date-fns
const dayMap: { [key: string]: number } = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

// Create a base date for the week
const getBaseDate = () => {
  const now = new Date();
  return startOfWeek(now, { weekStartsOn: 0 }); // Week starts on Sunday
};

// Week days array
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Time slots from 8 AM to 10 PM with half hour precision
const timeSlots = Array.from({ length: 29 }, (_, i) => {
  const halfHourIncrement = i / 2;
  const hour = Math.floor(8 + halfHourIncrement);
  const minutes = (i % 2) * 30;
  
  return {
    hour,
    minutes,
    label: `${hour > 12 ? hour - 12 : hour}:${minutes === 0 ? '00' : minutes} ${hour >= 12 ? 'PM' : 'AM'}`
  };
});

interface CalendarViewProps {
  courses: ScheduleCourse[] | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  instructor: string;
  sectionType: string;
  courseCode: string;
  isRequiredSession?: boolean;
  requiredFor?: string;
  timeOfDay: string;
}

export function CalendarView({ courses }: CalendarViewProps) {
  // State for tracking tooltip visibility and position
  const [tooltipEvent, setTooltipEvent] = useState<CalendarEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Transform the course data into events for the calendar
  const events = useMemo(() => {
    if (!courses) return [];
    
    const calendarEvents: CalendarEvent[] = [];
    
    for (const course of courses) {
      // Handle each time slot for the course
      for (const time of course.times) {
        // Get the day number (0-6, where 0 is Monday for our implementation)
        const dayNumber = dayMap[time.day];
        if (dayNumber === undefined) continue;
        
        // Parse start and end times
        const start = parseTimeString(time.start);
        const end = parseTimeString(time.end);
        
        // Create an event object
        calendarEvents.push({
          id: `${course.courseCode}-${time.day}-${time.start}`,
          title: course.title,
          day: dayNumber,
          startHour: start.hours,
          startMinute: start.minutes,
          endHour: end.hours,
          endMinute: end.minutes,
          instructor: course.instructor,
          sectionType: course.sectionType,
          isRequiredSession: course.isRequiredSession,
          requiredFor: course.requiredFor,
          courseCode: course.courseCode,
          timeOfDay: time.timeOfDay
        });
      }
    }
    
    return calendarEvents;
  }, [courses]);
    // Function to get the background color for an event
  const getEventBackgroundColor = (event: CalendarEvent) => {
    // Base color is determined by the course code
    // Extract the main course code (e.g., "MATH1007") from both regular course codes and 
    // tutorial/lab codes (e.g., "MATH1007AT")
    let mainCourseCode = event.courseCode;
    
    // If this is a required session (lab/tutorial), use its parent course code for color
    if (event.isRequiredSession && event.requiredFor) {
      mainCourseCode = event.requiredFor;
    }
    
    // Generate consistent color for this course
    const baseColor = stringToColor(mainCourseCode);
    
    // Apply some visual differentiation based on section type
    const opacity = event.isRequiredSession ? '90' : 'ff'; // Slightly transparent for required sessions
      return baseColor + opacity;
  };  // Function to calculate event position and height
  const getEventStyle = (event: CalendarEvent) => {
    // Convert event time to minutes since midnight
    const startInMinutes = event.startHour * 60 + event.startMinute;
    const endInMinutes = event.endHour * 60 + event.endMinute;
      // Define our calendar's time boundaries
    const dayStartInMinutes = 8 * 60; // Calendar starts at 8 AM
    const dayEndInMinutes = 22 * 60 + 30;  // Calendar ends at 10:30 PM to ensure we show full 10 PM hour
    const totalDayMinutes = dayEndInMinutes - dayStartInMinutes; // Total minutes displayed on calendar
    
    // Ensure events stay within our calendar bounds
    const clampedStartInMinutes = Math.max(startInMinutes, dayStartInMinutes);
    const clampedEndInMinutes = Math.min(endInMinutes, dayEndInMinutes);    // Calculate position from the top with precise positioning
    // We don't need to apply a correction anymore - using the actual time should be accurate
    const topPercentage = ((clampedStartInMinutes - dayStartInMinutes) / totalDayMinutes) * 100;
      
    // Calculate height based on exact duration
    const durationInMinutes = clampedEndInMinutes - clampedStartInMinutes;
    const heightPercentage = (durationInMinutes / totalDayMinutes) * 100;
    
    // Calculate size-dependent styling for dynamic text
    const duration = durationInMinutes / 60; // Duration in hours
    const isShortEvent = duration < 1.0; // Events under 1 hour are considered short
    const isVeryShortEvent = duration < 0.5; // Events under 30 minutes are very short
    
    // Better font sizing for different device screens and event lengths
    const fontSize = isShortEvent ? 'clamp(0.6rem, 1.5vw, 0.65rem)' : 'clamp(0.65rem, 1.5vw, 0.75rem)';
    const labelSize = isShortEvent ? 'clamp(0.5rem, 1.2vw, 0.55rem)' : 'clamp(0.55rem, 1.2vw, 0.65rem)';
    const showLabel = !isVeryShortEvent; // Hide tutorial/lab label for very short events
    
    // Return style object
    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      backgroundColor: getEventBackgroundColor(event),
      width: '100%', // Fill the full width      left: '0',     // Ensure alignment from the left edge
      right: '0',    // Ensure alignment to the right edge
      position: 'absolute',
      borderRadius: '4px',
      color: 'white',
      padding: isShortEvent ? '1px 2px' : '2px 3px', // Add horizontal padding for text
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: fontSize,
      fontWeight: 'normal', // No bold for course codes as requested
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)',
      // Improve text readability with text shadow
      textShadow: '0px 1px 2px rgba(0,0,0,0.7)',
      // Pass custom properties to be used in the component
      '--label-size': labelSize,
      '--show-label': showLabel ? 'block' : 'none'
    } as React.CSSProperties & { 
      '--label-size': string;
      '--show-label': string;
    };
  };
    return (    <div 
      ref={calendarRef}
      className="calendar-container mt-6 rounded-xl border border-gray-100 bg-[#fcfcfd] shadow-sm hover:shadow-md transition-all relative overflow-x-auto"
    >
      {/* Custom tooltip */}
      <EventTooltip 
        event={tooltipEvent!} 
        visible={tooltipEvent !== null} 
        position={tooltipPosition}
      />
      <div className="grid grid-cols-8 h-[600px] min-w-[768px]"> {/* Set minimum width for scrolling on mobile */}
        {/* Time axis */}
        <div className="col-span-1 border-r border-gray-200">
          {/* Empty header cell */}          <div className="h-10 border-b border-gray-100 flex items-center justify-center bg-gradient-to-r from-indigo-50 to-indigo-100/50">
            <span className="text-sm font-medium text-gray-700">Time</span>
          </div>
          
          {/* Time slots */}          <div className="relative h-[calc(100%-2.5rem)]">
            {timeSlots.map((slot, index) => (
              <div 
                key={index} 
                className={`absolute w-full border-t ${slot.minutes === 0 ? 'border-gray-200' : 'border-gray-100'} flex items-start justify-center text-xs text-gray-500 font-medium`}
                style={{ top: `${(index / timeSlots.length) * 100}%`, height: `${100 / timeSlots.length}%` }}
              >
                {slot.minutes === 0 ? slot.label : ''}
              </div>
            ))}
          </div>
        </div>
          {/* Days columns */}
        {weekDays.map((day, dayIndex) => (
          <div key={day} className="col-span-1 border-r last:border-r-0 border-gray-200">
            {/* Day header */}            <div className="h-10 border-b border-gray-100 flex items-center justify-center bg-gradient-to-r from-indigo-50 to-indigo-100/50">
              <span className="text-sm font-medium text-gray-700">{format(addDays(getBaseDate(), dayIndex), 'EEE', { locale: enUS })}</span>
            </div>
            
            {/* Day events container */}
            <div className="relative h-[calc(100%-2.5rem)] overflow-hidden">              {/* Time grid lines */}
              {timeSlots.map((slot, index) => (
                <div 
                  key={index}
                  className={`absolute w-full border-t ${slot.minutes === 0 ? 'border-gray-200' : 'border-gray-100'}`}
                  style={{ top: `${(index / timeSlots.length) * 100}%`, height: `${100 / timeSlots.length}%` }}
                />
              ))}{/* Events */}
                {events
                .filter(event => event.day === dayIndex)
                .map(event => (
                  <div
                    key={event.id}
                    className="absolute inset-x-0 hover:z-10 transition-transform hover:scale-[1.01]"
                    style={getEventStyle(event)}
                    onMouseEnter={(e) => {
                      setTooltipEvent(event);
                      setTooltipPosition({ 
                        x: e.clientX - (calendarRef.current?.getBoundingClientRect().left || 0),
                        y: e.clientY - (calendarRef.current?.getBoundingClientRect().top || 0)
                      });
                    }}
                    onMouseMove={(e) => {
                      setTooltipPosition({ 
                        x: e.clientX - (calendarRef.current?.getBoundingClientRect().left || 0),
                        y: e.clientY - (calendarRef.current?.getBoundingClientRect().top || 0)
                      });
                    }}
                    onMouseLeave={() => {
                      setTooltipEvent(null);
                    }}                  >
                    <div className="flex flex-col justify-center h-full px-1">
                      <div className="font-normal tracking-wider text-center">{event.courseCode}</div>
                      
                      {/* Show time range for longer events */}
                      {(event.endHour * 60 + event.endMinute) - (event.startHour * 60 + event.startMinute) >= 60 && (                        <div 
                          className="text-center text-white/90" 
                          style={{ 
                            fontSize: 'var(--label-size, 0.65rem)'
                          }}                        >
                          {`${event.startHour % 12 || 12}:${event.startMinute.toString().padStart(2, '0')} ${event.startHour >= 12 ? 'PM' : 'AM'} - ${event.endHour % 12 || 12}:${event.endMinute.toString().padStart(2, '0')} ${event.endHour >= 12 ? 'PM' : 'AM'}`}
                        </div>
                      )}
                      
                      {event.isRequiredSession && (
                        <div 
                          className="opacity-90 text-center" 
                          style={{ 
                            fontSize: 'var(--label-size, 0.65rem)',
                            display: 'var(--show-label, block)'
                          }}
                        >
                          Tutorial/Lab
                        </div>
                      )}
                    </div>
                  </div>                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
