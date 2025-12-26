'use client';

/**
 * Toast Component
 * Modern toast notification system
 */

import { useEffect } from 'react';
import { CheckCircleIcon, ExclamationIcon, XCircleIcon, InformationCircleIcon, XIcon } from './Icons';

export default function Toast({ message, type = 'info', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500',
      text: 'text-green-900'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: XCircleIcon,
      iconColor: 'text-red-500',
      text: 'text-red-900'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      icon: ExclamationIcon,
      iconColor: 'text-amber-500',
      text: 'text-amber-900'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-500',
      text: 'text-blue-900'
    }
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.text} border-l-4 ${config.border} rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in-right`}>
      <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </div>
  );
}
