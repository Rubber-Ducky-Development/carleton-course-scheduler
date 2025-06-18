'use client';

import { Button } from '@/components/ui/button';
import { CourseForm } from '@/components/forms/course-form';
import { BufferTimeForm } from '@/components/forms/buffer-time-form';
import { AvailabilityForm } from '@/components/forms/availability-form';
import { SchedulerForm } from '@/components/forms/scheduler-form';
import { ScheduleDisplay } from '@/components/scheduler/schedule-display';
import { Header } from '@/components/layout/header';
import { useSchedulerStore } from '@/lib/store/scheduler';
import { useScheduleStore } from '@/lib/store/schedule';

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
          </div>          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column for course preferences */}
            <div className="lg:w-1/2">
              <section className="mb-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-md mr-2 text-sm">1</span>
                  Course Preferences
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                  {preferences.courses.map((_, index) => (
                    <CourseForm key={index} index={index} />
                  ))}
                </div>                {preferences.courses.length < 7 && (
                  <div className="mt-5">
                    <Button
                      onClick={addCourse}
                      variant="outline"
                      className="w-full hover:bg-indigo-50"
                    >
                      Add Another Course
                    </Button>
                  </div>
                )}
              </section>
            </div>            {/* Right column for schedule preferences and availability */}
            <div className="lg:w-1/2">
              <section className="mb-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-md mr-2 text-sm">2</span>
                  Schedule Preferences
                </h2>
                <BufferTimeForm />
              </section>              <section className="mb-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-md mr-2 text-sm">3</span>
                  Availability
                </h2>
                <AvailabilityForm />
              </section>
                <section className="mb-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-purple-200 pb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-md mr-2 text-sm">4</span>
                  Generate
                </h2>
                <SchedulerForm />
              </section>
            </div>
          </div>          <section className="mt-8 border-t border-indigo-200 pt-8">
            <ScheduleDisplay />
          </section>
        </div>
      </main>
        <footer className="border-t border-indigo-100 bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Termwise. All rights reserved.
          <br />
          <span className="text-indigo-500">Made with ❤️ by Rubber Ducky Development</span>
          <br />
          <span className="text-xs text-gray-400 mt-2 block">We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Carleton University, or any of its subsidiaries or its affiliates.</span>
        </div>
      </footer>
    </div>
  );
}
