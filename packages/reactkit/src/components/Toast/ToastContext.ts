import React from 'react';
import type { ToastOptions } from './Toast.types';

export interface ToastContextValue {
  /** Shows a new toast and returns its id. */
  show: (options: ToastOptions) => string;
  /** Dismisses the toast with the given id, playing its exit animation. */
  dismiss: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextValue>({
  show: () => '',
  dismiss: () => {},
});
