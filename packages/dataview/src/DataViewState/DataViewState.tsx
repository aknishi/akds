import React from 'react';
import { Button, Flexbox, Spinner, Text } from '@aknishi/akds-reactkit';
import { ErrorIcon } from '@aknishi/akds-icons';
import type { DataViewStateProps, DataViewStatus } from './DataViewState.types';
import { DataViewMessage } from '../DataViewMessage';

const DEFAULT_ERROR = 'Couldn’t load the data.';

/** The state to show in place of the rows, or undefined when there are rows to show. */
export function getDataViewStatus(
  rowCount: number,
  { loading, loadingMore, error }: Pick<DataViewStateProps, 'loading' | 'loadingMore' | 'error'>,
): DataViewStatus | undefined {
  if (rowCount > 0) return undefined;
  // Loading first: a retry replaces the error, and "No results." would be
  // wrong until loading finishes. With no rows, loading more is the first load.
  if (loading || loadingMore) return 'loading';
  if (error) return 'error';
  return 'empty';
}

interface DataViewStateContentProps extends DataViewStateProps {
  status: DataViewStatus;
}

/**
 * The content of a view's loading, error, or empty state: the team's own
 * layout when given, otherwise the default. Each view supplies the wrapper
 * (a table cell or a block), so the states sit right in either layout.
 * Internal — not exported.
 */
export function DataViewStateContent({
  status,
  error,
  onRetry,
  loadingState,
  errorState,
  emptyState,
}: DataViewStateContentProps) {
  if (status === 'loading') {
    // undefined means "use the default"; null hides the state on purpose.
    return <>{loadingState !== undefined ? loadingState : (
      <DataViewMessage icon={<Spinner size="sm" />} title="Loading…" />
    )}</>;
  }

  if (status === 'error') {
    return (
      // Wraps custom layouts too, so a failure is always announced. It's
      // inserted only when the error appears, which is what triggers the
      // announcement, including after a failed retry.
      <div role="alert">
        {errorState !== undefined ? errorState : (
          <DataViewMessage
            icon={<ErrorIcon color="error" />}
            title={error === true ? DEFAULT_ERROR : error}
            action={onRetry && (
              <Button size="sm" appearance="bordered" onClick={onRetry}>
                Try again
              </Button>
            )}
          />
        )}
      </div>
    );
  }

  return <>{emptyState !== undefined ? emptyState : <DataViewMessage title="No results." />}</>;
}

/**
 * Keeps keyboard focus in place as the states change. Pressing "Try again"
 * swaps the error for the loading state, which removes the focused button
 * and would drop focus to the page. When focus was in the state, it moves to
 * the state's wrapper instead, and once rows arrive, to `onRowsShown`'s
 * target. Focus elsewhere on the page is never moved.
 */
export function useDataViewStateFocus(status: DataViewStatus | undefined, onRowsShown: () => void) {
  const stateRef = React.useRef<HTMLElement | null>(null);
  const hadFocusRef = React.useRef(false);
  const onRowsShownRef = React.useRef(onRowsShown);
  onRowsShownRef.current = onRowsShown;

  React.useLayoutEffect(() => {
    if (!hadFocusRef.current) return;
    const active = document.activeElement;
    // Focus is still on something real, e.g. the user moved on.
    if (active && active !== document.body) {
      if (!stateRef.current?.contains(active)) hadFocusRef.current = false;
      return;
    }
    if (stateRef.current) {
      stateRef.current.focus();
    } else {
      hadFocusRef.current = false;
      onRowsShownRef.current();
    }
  }, [status]);

  return {
    ref: (node: HTMLElement | null) => {
      stateRef.current = node;
    },
    // Focusable from script only, never a tab stop.
    tabIndex: -1,
    onFocus: () => {
      hadFocusRef.current = true;
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const target = e.target;
      // A focused element that's being removed (the "Try again" button)
      // keeps the flag; focus deliberately moved somewhere still on the
      // page clears it. Checked after the event, once removal is done.
      queueMicrotask(() => {
        if (target.isConnected && !stateRef.current?.contains(document.activeElement)) {
          hadFocusRef.current = false;
        }
      });
    },
  };
}

/**
 * Shown after the last row while more rows load. Visible text rather than a
 * live region: the rows that follow are what tells users the load finished.
 * Internal — not exported.
 */
export function DataViewLoadingMore({ className }: { className?: string }) {
  return (
    <Flexbox justify="center" align="center" gap="sm" className={className}>
      <Spinner size="sm" aria-hidden="true" />
      <Text as="span" styleAs="caption">Loading more…</Text>
    </Flexbox>
  );
}

/**
 * Keeps the view's height when its rows give way to the loading or error
 * state, so the table or cards don't collapse to the message's height and
 * everything below (e.g. Pagination) stays where it was. Attach
 * `contentRef` to the element holding the rows or the state, and apply
 * `heldHeight` to the state. It holds the height shown just before the
 * state appeared, so a retry after a short "No results." stays short. The
 * views add a minimum on top (--akds-dataview-state-min-height), so every
 * state starts at the same height.
 * Internal — not exported.
 */
export function useHeldHeight<T extends HTMLElement>(status: DataViewStatus | undefined, enabled = true) {
  const contentRef = React.useRef<T | null>(null);
  const lastHeightRef = React.useRef<number | undefined>(undefined);
  const heldHeightRef = React.useRef<number | undefined>(undefined);
  const wasHoldingRef = React.useRef(false);
  const holding = enabled && (status === 'loading' || status === 'error');

  // Decided during render, from the height measured after the previous
  // commit, so the first frame of the state already has the right height.
  if (holding && !wasHoldingRef.current) heldHeightRef.current = lastHeightRef.current;
  if (!holding) heldHeightRef.current = undefined;

  React.useLayoutEffect(() => {
    wasHoldingRef.current = holding;
    const element = contentRef.current;
    if (!element) return undefined;
    const measure = () => {
      lastHeightRef.current = element.getBoundingClientRect().height;
    };
    measure();
    // Cards reflow when the view is resized, which changes their height.
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  });

  return { contentRef, heldHeight: heldHeightRef.current };
}
