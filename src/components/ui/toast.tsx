import React from 'react';
import { Toast as ToastType } from './use-toast';

interface ToastProps {
  toasts: ToastType[];
  dismiss: (id: string) => void;
}

export function Toast({ toasts, dismiss }: ToastProps) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out ${
            toast.variant === 'destructive'
              ? 'bg-red-500 text-white'
              : toast.variant === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-4 text-sm opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 