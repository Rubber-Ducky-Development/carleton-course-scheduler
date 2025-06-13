'use client';

import { CourseForm } from '@/components/forms/course-form';
import { BufferTimeForm } from '@/components/forms/buffer-time-form';
import { AvailabilityForm } from '@/components/forms/availability-form';
import { SchedulerForm } from '@/components/forms/scheduler-form';
import { Header } from '@/components/layout/header';
import { useSchedulerStore } from '@/lib/store/scheduler';

export default function Home() {
  const { preferences } = useSchedulerStore();
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Course Scheduler
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enter your preferences to generate an optimal schedule
            </p>
          </div>
          
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Course Preferences
            </h2>
            
            {preferences.courses.map((_, index) => (
              <CourseForm key={index} index={index} />
            ))}
          </section>
          
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Schedule Preferences
            </h2>
            
            <BufferTimeForm />
          </section>
          
          <section className="mb-8">
            <AvailabilityForm />
          </section>
          
          <section>
            <SchedulerForm />
          </section>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Course Scheduler. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
