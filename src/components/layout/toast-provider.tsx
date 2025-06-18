'use client';

import { ReactNode, useEffect } from 'react';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

// Set the maximum number of toasts to display at once
const MAX_TOASTS = 3;

// Custom configuration for the toast
interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
}

export function ToastProvider({ 
  children, 
  position = 'top-right' 
}: ToastProviderProps) {
    // Configure toast to only show 3 at a time using simpler approach
  useEffect(() => {
    // Simple approach to limit toasts by setting a function that checks active toasts
    const limitToasts = () => {
      // Gets the active toasts from the DOM
      const toastElements = document.querySelectorAll('[data-toast]');
      
      // If we have too many toasts, remove the oldest ones
      if (toastElements.length > MAX_TOASTS) {
        // We want to keep the newest toasts (latest items)
        const toastsToDismiss = Array.from(toastElements).slice(0, toastElements.length - MAX_TOASTS);
        
        // Dismiss the oldest toasts
        toastsToDismiss.forEach(el => {
          const id = el.getAttribute('data-id');
          if (id) toast.dismiss(id);
        });
      }
    };
    
    // Create a wrapper for toast methods to apply our limit
    const originalSuccess = toast.success;
    const originalError = toast.error;
    const originalLoading = toast.loading;
    
    // Override toast methods
    toast.success = (message, options) => {
      setTimeout(limitToasts, 100); // Check after toast is rendered
      return originalSuccess(message, options);
    };
    
    toast.error = (message, options) => {
      setTimeout(limitToasts, 100); // Check after toast is rendered
      return originalError(message, options);
    };
    
    toast.loading = (message, options) => {
      setTimeout(limitToasts, 100); // Check after toast is rendered
      return originalLoading(message, options);
    };
    
    // Restore the originals on unmount
    return () => {
      toast.success = originalSuccess;
      toast.error = originalError;
      toast.loading = originalLoading;
    };
  }, []);

  return (
    <>
      {children}
      <Toaster 
        position={position}
        gutter={8} 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#F9FAFB',
            color: '#4B5563',
            border: '1px solid #E5E7EB',
            fontSize: '0.875rem',
          },
          success: {
            style: {
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #D1FAE5',
            },
          },
          error: {
            style: {
              background: '#FEF2F2',
              color: '#B91C1C',
              border: '1px solid #FEE2E2',
            },
          },
        }}
      />
    </>
  );
}
