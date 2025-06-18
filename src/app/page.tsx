'use client';

import { Card } from '@/components/ui/card';
import { CourseForm } from '@/components/forms/course-form';
import { BufferTimeForm } from '@/components/forms/buffer-time-form';
import { AvailabilityDayForm } from '@/components/forms/availability-form';
import { SchedulerForm } from '@/components/forms/scheduler-form';
import { ScheduleDisplay } from '@/components/scheduler/schedule-display';
import { Header } from '@/components/layout/header';
import { useSchedulerStore } from '@/lib/store/scheduler';

export default function Home() {
  const { preferences, addCourse } = useSchedulerStore();
    return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f2f7] to-[#e8ecf7]">
      <Header />
      
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800 sm:text-4xl">
              Termwise <span className="text-indigo-600">🌟</span>
            </h1>
            <p className="text-base text-gray-600 max-w-lg mx-auto">
              Enter your preferences to generate an optimal schedule
            </p>
          </div>

          {/* Course Preferences Section */}
          <section className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">
              <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-md mr-2 text-sm">1</span>
              Course Preferences
            </h2>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {preferences.courses.map((_, index) => (
                <CourseForm key={index} index={index} />
              ))}
                {preferences.courses.length < 7 && (
                <Card 
                  className="flex items-center justify-center p-4 cursor-pointer border-dashed border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md transition-all min-h-[200px]"
                  onClick={addCourse}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center transform transition-all duration-200 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-indigo-600 font-medium">Add Another Course</p>
                  </div>
                </Card>
              )}
            </div>
          </section>          {/* Availability Section (3 per row with Buffer Time) */}
          <section className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">
              <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-md mr-2 text-sm">2</span>
              Availability & Schedule Preferences
            </h2>
            
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => useSchedulerStore.getState().resetAvailabilityPreferences()}
                className="text-xs px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg border border-indigo-200 transition-colors"
                title="Reset only availability preferences"
              >
                Reset All to Available
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Monday */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
                <AvailabilityDayForm day="Monday" />
              </div>
              
              {/* Tuesday */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
                <AvailabilityDayForm day="Tuesday" />
              </div>
              
              {/* Wednesday */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
                <AvailabilityDayForm day="Wednesday" />
              </div>
              
              {/* Thursday */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
                <AvailabilityDayForm day="Thursday" />
              </div>
              
              {/* Friday */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
                <AvailabilityDayForm day="Friday" />
              </div>
              
              {/* Buffer Time */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
                <BufferTimeForm />
              </div>
            </div>
          </section>          {/* Generate Schedule Section */}
          <section className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">
              <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-md mr-2 text-sm">3</span>
              Generate Your Schedule
            </h2>
            <div className="flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <p className="text-center mb-4 text-gray-600">
                  Click below to generate your optimal schedule based on your preferences
                </p>
                <SchedulerForm />
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-indigo-200 pt-8">
            <ScheduleDisplay />
          </section>
        </div>
      </main>
        <footer className="border-t border-indigo-100 bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Termwise. All rights reserved.
          <br />
          <span className="text-indigo-500">Made with ❤️ by <a href="https://github.com/Rubber-Ducky-Development" className="hover:text-indigo-700" target="_blank" rel="noopener noreferrer">Rubber Ducky Development</a></span>
          <br />
          <span className="text-xs text-gray-400 mt-2 block">We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Carleton University, or any of its subsidiaries or its affiliates.</span>
        </div>
      </footer>
    </div>
  );
}
