import React from 'react';

export type ToastEmphasis = 'accented' | 'neutral' | 'success' | 'destructive';
export type ToastPlacement = 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastOptions {
  /** Content rendered inside the toast. */
  message: React.ReactNode;
  /** Conveys the intent or meaning of the toast. Defaults to `'neutral'`. */
  emphasis?: ToastEmphasis;
  /** Corner of the viewport the toast stacks in. Defaults to the `ToastProvider`'s `placement`. */
  placement?: ToastPlacement;
  /**
   * When false, the toast stays open until closed manually instead of
   * auto-dismissing. Defaults to the `ToastProvider`'s `autoDismiss`.
   */
  autoDismiss?: boolean;
  /**
   * Time in milliseconds before the toast auto-dismisses. Ignored when
   * `autoDismiss` is false. Defaults to the `ToastProvider`'s `duration`.
   */
  duration?: number;
  /**
   * Icon rendered before the message. Defaults to an icon based on
   * `emphasis`; pass `null` to render no icon.
   */
  icon?: React.ReactNode;
}

export interface ToastProviderProps {
  /** Default corner new toasts stack in when a toast doesn't specify its own `placement`. */
  placement?: ToastPlacement;
  /** Default for whether toasts auto-dismiss when they don't specify their own `autoDismiss`. Defaults to `true`. */
  autoDismiss?: boolean;
  /**
   * Default auto-dismiss time in milliseconds for toasts that don't specify
   * their own `duration`.
   */
  duration?: number;
  /** Content rendered inside the provider. */
  children: React.ReactNode;
}
