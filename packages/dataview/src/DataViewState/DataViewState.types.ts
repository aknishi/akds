import type React from 'react';

/** Which state a view shows in place of its rows. Loading wins over error, and error over empty. */
export type DataViewStatus = 'loading' | 'error' | 'empty';

/** The loading, error, and empty state props shared by TableView and CardView. */
export interface DataViewStateProps {
  /**
   * Marks the view as loading rows that will replace the ones shown, e.g.
   * after a sort, page change, or search. While there are no rows, the
   * loading state replaces the error and empty states. While rows are shown,
   * they stay in place, faded, with a progress bar under the header, so
   * focus and scroll position are kept. Also sets `aria-busy`.
   */
  loading?: boolean;
  /**
   * Marks the view as loading rows that will be added after the ones shown,
   * e.g. the next page of an infinite list. Rows stay at full strength, with
   * a "Loading more…" indicator after the last one. While there are no rows,
   * it shows the loading state, like `loading`. `loading` wins when both are
   * set. Also sets `aria-busy`.
   */
  loadingMore?: boolean;
  /**
   * Shows the error state while there are no rows. Pass a message, e.g.
   * "Couldn't load orders.", or `true` for the default message. Loading
   * takes priority, so the error is replaced while a retry is in progress.
   * When rows are already shown, show the error yourself, e.g. next to a
   * "Load more" button.
   */
  error?: React.ReactNode;
  /** Adds a "Try again" button to the default error state. */
  onRetry?: (() => void) | undefined;
  /**
   * Replaces the default loading layout. Use DataViewMessage to keep the
   * standard look. DataView still decides when it shows and sets `aria-busy`.
   */
  loadingState?: React.ReactNode;
  /**
   * Replaces the default error layout. Use DataViewMessage to keep the
   * standard look. DataView still decides when it shows and wraps it in
   * `role="alert"`, so it's always announced. Include your own retry
   * action, since `onRetry` only applies to the default layout.
   */
  errorState?: React.ReactNode;
  /**
   * Replaces the default "No results." layout, e.g. with a message and a
   * "Create order" action. Use DataViewMessage to keep the standard look.
   */
  emptyState?: React.ReactNode;
}
