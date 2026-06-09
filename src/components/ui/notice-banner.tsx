'use client';

import { ReactNode, useState } from 'react';

interface NoticeBannerProps {
  /**
   * Banner content - can be string or React nodes for formatted content
   */
  children: ReactNode;
  
  /**
   * Option to allow dismissing the banner
   * @default true
   */
  dismissible?: boolean;
  
  /**
   * Type of banner which affects styling
   * @default "info"
   */
  type?: 'info' | 'warning' | 'success' | 'error';
  
  /**
   * Banner title (optional)
   */
  title?: string;
}

export function NoticeBanner({
  children,
  dismissible = true,
  type = 'info',
  title
}: NoticeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) {
    return null;
  }
  
  // Color schemes for different banner types
  const colorSchemes = {
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      title: 'text-blue-900',
      icon: 'text-blue-600'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      title: 'text-amber-900',
      icon: 'text-amber-600'
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      title: 'text-emerald-900',
      icon: 'text-emerald-600'
    },
    error: {
      bg: 'bg-gradient-to-r from-rose-50 to-red-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
      title: 'text-rose-900',
      icon: 'text-rose-600'
    }
  };
  
  const colors = colorSchemes[type];
  
  return (
    <div className={`px-4 py-3 rounded-lg shadow-sm ${colors.bg} border ${colors.border} relative mb-6`}>
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h3 className={`text-sm font-semibold mb-1 ${colors.title}`}>{title}</h3>}
          <div className={`text-sm ${colors.text}`}>
            {children}
          </div>
        </div>
        
        {dismissible && (          <button
            onClick={() => setDismissed(true)}
            className={`ml-3 flex-shrink-0 p-1 rounded-md hover:bg-white/30 transition-colors ${colors.icon}`}
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
