'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';

export function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    // Reset the form after a short delay to ensure the closing animation plays
    setTimeout(() => {
      setFeedback('');
      setError(null);
      setSuccess(false);
    }, 300);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setError('Please enter your feedback');
      return;
    }
    
    if (feedback.length > 3000) {
      setError('Feedback cannot exceed 3000 characters');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSuccess(true);
      setFeedback('');
      
      // Close the dialog after a delay
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = feedback.length;
  const characterLimit = 3000;  return (
    <>      <Button
        onClick={openModal}
        variant="secondary"
        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-400 hover:bg-gray-500 text-white"
        size="sm"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="h-3 w-3 sm:h-4 sm:w-4"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
          />
        </svg>
        <span className="text-xs sm:text-sm">Submit Feedback</span>
      </Button>

      <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Submit Feedback
                  </Dialog.Title>
                  
                  <div className="mt-2">                    <p className="text-sm text-gray-500">
                      We appreciate your feedback! Please let us know if you&apos;ve encountered any bugs or have suggestions for improvement.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Enter your feedback here..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                          maxLength={characterLimit}
                          disabled={isSubmitting}
                        />
                        <div className="mt-1 flex justify-end">
                          <span className={`text-xs ${characterCount > characterLimit ? 'text-red-500' : 'text-gray-500'}`}>
                            {characterCount}/{characterLimit}
                          </span>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="text-sm text-red-500">
                          {error}
                        </div>
                      )}
                      
                      {success && (
                        <div className="text-sm text-green-500">
                          Thank you for your feedback!
                        </div>
                      )}

                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          type="button"
                          onClick={closeModal}
                          variant="outline"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
