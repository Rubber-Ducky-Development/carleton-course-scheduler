'use client';

import { Button } from '@/components/ui/button';
import { CourseForm } from '@/components/forms/course-form';
import { BufferTimeForm } from '@/components/forms/buffer-time-form';
import { AvailabilityForm } from '@/components/forms/availability-form';
import { SchedulerForm } from '@/components/forms/scheduler-form';
import { Header } from '@/components/layout/header';
import { useSchedulerStore } from '@/lib/store/scheduler';

export default function Home() {
  const { preferences, addCourse } = useSchedulerStore();
  return (
    <div className="flex min-h-screen flex-col bg-amber-50 dark:bg-amber-900">
      <Header />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-amber-900 dark:text-amber-100 sm:text-4xl">
              Course Scheduler
            </h1>
            <p className="text-lg text-amber-700 dark:text-amber-300">
              Enter your preferences to generate an optimal schedule
            </p>
          </div>

          <section className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-amber-950 dark:shadow-amber-900/20">
            <h2 className="mb-4 text-xl font-semibold text-amber-900 dark:text-amber-100">
              Course Preferences
            </h2>

            {preferences.courses.map((_, index) => (
              <CourseForm key={index} index={index} />
            ))}

            {preferences.courses.length < 7 && (
              <div className="mt-4">
                <Button
                  onClick={addCourse}
                  variant="outline"
                  className="w-full"
                >
                  Add Another Course
                </Button>
              </div>
            )}
          </section>

          <section className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-amber-950 dark:shadow-amber-900/20">
            <h2 className="mb-4 text-xl font-semibold text-amber-900 dark:text-amber-100">
              Schedule Preferences
            </h2>

            <BufferTimeForm />
          </section>

          <section className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-amber-950 dark:shadow-amber-900/20">
            <AvailabilityForm />
          </section>

          <section className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-amber-950 dark:shadow-amber-900/20">
            <SchedulerForm />
          </section>
        </div>
      </main>

      <footer className="border-t border-amber-200 bg-amber-100 px-4 py-6 dark:border-amber-700 dark:bg-amber-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-amber-800 dark:text-amber-200">
          &copy; {new Date().getFullYear()} Course Scheduler. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
