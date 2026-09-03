import React from 'react';
import { ToastContext } from './ToastContext';
import type { ToastContextValue } from './ToastContext';

/**
 * Returns `show`/`dismiss` for imperatively triggering toasts from the
 * nearest `ToastProvider`. Falls back to no-ops if used outside a provider.
 */
export function useToast(): ToastContextValue {
  return React.useContext(ToastContext);
}
