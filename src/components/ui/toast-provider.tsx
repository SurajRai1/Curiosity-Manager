'use client';

import React, { createContext, useContext } from 'react';
import { useToast } from './use-toast';
import { Toast } from './toast';

export const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastHelpers = useToast();
  
  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      <Toast toasts={toastHelpers.toasts} dismiss={toastHelpers.dismiss} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
} 