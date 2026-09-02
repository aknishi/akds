import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ToastProvider } from '../../../components/Toast/Toast';
import { useToast } from '../../../components/Toast/useToast';
import type { ToastContextValue } from '../../../components/Toast/ToastContext';
import type { ToastProviderProps } from '../../../components/Toast/Toast.types';

expect.extend(toHaveNoViolations);

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// jsdom implements neither ResizeObserver nor Range.getClientRects() —
// ToastCard uses both to detect whether the message wraps to more than one
// line. Default to "single line" (one rect) unless a test overrides it.
vi.stubGlobal('ResizeObserver', MockResizeObserver);

beforeEach(() => {
  Range.prototype.getClientRects = vi.fn().mockReturnValue([{}]);
});

function Trigger({ onReady }: { onReady: (api: ToastContextValue) => void }) {
  const api = useToast();
  React.useEffect(() => { onReady(api); }, [api, onReady]);
  return null;
}

function renderToastProvider(providerProps: Partial<ToastProviderProps> = {}) {
  const apiRef: { current: ToastContextValue | null } = { current: null };
  const utils = render(
    <ToastProvider {...providerProps}>
      <Trigger onReady={api => { apiRef.current = api; }} />
    </ToastProvider>,
  );
  return {
    ...utils,
    show: (options: Parameters<ToastContextValue['show']>[0]) => apiRef.current!.show(options),
    dismiss: (id: string) => apiRef.current!.dismiss(id),
  };
}

describe('Toast', () => {
  it('useToast falls back to safe no-ops outside a ToastProvider', () => {
    const apiRef: { current: ToastContextValue | null } = { current: null };
    render(<Trigger onReady={api => { apiRef.current = api; }} />);
    expect(() => {
      const id = apiRef.current!.show({ message: 'Untracked' });
      expect(id).toBe('');
      apiRef.current!.dismiss('anything');
    }).not.toThrow();
  });

  it('renders a toast with the message when shown', () => {
    const { show } = renderToastProvider();
    act(() => { show({ message: 'Saved successfully' }); });
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('applies base and default emphasis classes', () => {
    const { show } = renderToastProvider();
    act(() => { show({ message: 'Hello' }); });
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('akds-toast');
    expect(toast).toHaveClass('akds-toast--neutral');
  });

  it('centers icon/message/close when the message renders on a single line', () => {
    Range.prototype.getClientRects = vi.fn().mockReturnValue([{}]);
    const { show } = renderToastProvider();
    act(() => { show({ message: 'One line' }); });
    expect(screen.getByRole('status')).toHaveClass('akds-toast--single-line');
  });

  it('top-aligns icon/message/close once the message wraps to more than one line', () => {
    Range.prototype.getClientRects = vi.fn().mockReturnValue([{}, {}]);
    const { show } = renderToastProvider();
    act(() => { show({ message: 'A message long enough to wrap onto more than one line' }); });
    expect(screen.getByRole('status')).not.toHaveClass('akds-toast--single-line');
  });

  it('applies the correct class for each emphasis', () => {
    for (const emphasis of ['accented', 'neutral', 'success', 'destructive'] as const) {
      const { show, unmount } = renderToastProvider();
      act(() => { show({ emphasis, message: 'Message' }); });
      expect(screen.getByText('Message').closest('.akds-toast')).toHaveClass(`akds-toast--${emphasis}`);
      unmount();
    }
  });

  it('uses role="alert" and aria-live="assertive" for destructive toasts', () => {
    const { show } = renderToastProvider();
    act(() => { show({ emphasis: 'destructive', message: 'Something broke' }); });
    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses role="status" and aria-live="polite" for non-destructive toasts', () => {
    const { show } = renderToastProvider();
    act(() => { show({ emphasis: 'success', message: 'All good' }); });
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('stacks multiple toasts, newest last in the DOM', () => {
    const { show } = renderToastProvider();
    act(() => { show({ message: 'First' }); });
    act(() => { show({ message: 'Second' }); });
    const messages = screen.getAllByText(/First|Second/);
    expect(messages.map(el => el.textContent)).toEqual(['First', 'Second']);
  });

  it('groups toasts by placement into separate viewports', () => {
    const { show } = renderToastProvider();
    act(() => { show({ message: 'Left', placement: 'bottom-left' }); });
    act(() => { show({ message: 'Right', placement: 'bottom-right' }); });
    expect(document.querySelector('.akds-toast__viewport--bottom-left')).toContainElement(screen.getByText('Left'));
    expect(document.querySelector('.akds-toast__viewport--bottom-right')).toContainElement(screen.getByText('Right'));
  });

  it('renders the default icon for each emphasis with a status icon', () => {
    const { show } = renderToastProvider();
    act(() => { show({ emphasis: 'success', message: 'Done' }); });
    expect(screen.getByText('Done').closest('.akds-toast')!.querySelector('.akds-toast__icon')).toBeInTheDocument();
  });

  it('renders no icon for neutral emphasis by default', () => {
    const { show } = renderToastProvider();
    act(() => { show({ message: 'Plain' }); });
    expect(screen.getByText('Plain').closest('.akds-toast')!.querySelector('.akds-toast__icon')).not.toBeInTheDocument();
  });

  it('suppresses the icon when icon is explicitly set to null', () => {
    const { show } = renderToastProvider();
    act(() => { show({ emphasis: 'success', message: 'No icon', icon: null }); });
    expect(screen.getByText('No icon').closest('.akds-toast')!.querySelector('.akds-toast__icon')).not.toBeInTheDocument();
  });

  it('dismisses the toast when the close button is clicked', async () => {
    const user = userEvent.setup();
    const { show } = renderToastProvider();
    act(() => { show({ message: 'Closable' }); });
    const toast = screen.getByText('Closable').closest('.akds-toast') as HTMLElement;
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(toast).toHaveClass('akds-toast--closing');
  });

  it('removes the toast from the DOM after its exit animation ends', async () => {
    const user = userEvent.setup();
    const { show } = renderToastProvider();
    act(() => { show({ message: 'Closable' }); });
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    const toast = screen.getByText('Closable').closest('.akds-toast') as HTMLElement;
    // jsdom has no AnimationEvent, so React falls back to the vendor-prefixed
    // "webkitAnimationEnd" native event name it detects from the style object —
    // fireEvent.animationEnd (plain "animationend") never reaches the handler here.
    act(() => { toast.dispatchEvent(new Event('webkitAnimationEnd', { bubbles: true })); });
    expect(screen.queryByText('Closable')).not.toBeInTheDocument();
  });

  describe('auto-dismiss timing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('auto-dismisses after the default 7000ms duration', () => {
      const { show } = renderToastProvider();
      act(() => { show({ message: 'Auto' }); });
      const toast = screen.getByRole('status');
      act(() => { vi.advanceTimersByTime(7000); });
      expect(toast).toHaveClass('akds-toast--closing');
    });

    it('respects a custom duration passed to show', () => {
      const { show } = renderToastProvider();
      act(() => { show({ message: 'Quick', duration: 2000 }); });
      const toast = screen.getByRole('status');
      act(() => { vi.advanceTimersByTime(1999); });
      expect(toast).not.toHaveClass('akds-toast--closing');
      act(() => { vi.advanceTimersByTime(1); });
      expect(toast).toHaveClass('akds-toast--closing');
    });

    it('respects a custom default duration on the provider', () => {
      const { show } = renderToastProvider({ duration: 1000 });
      act(() => { show({ message: 'Provider default' }); });
      const toast = screen.getByRole('status');
      act(() => { vi.advanceTimersByTime(1000); });
      expect(toast).toHaveClass('akds-toast--closing');
    });

    it('does not auto-dismiss when autoDismiss is false', () => {
      const { show } = renderToastProvider();
      act(() => { show({ message: 'Persistent', autoDismiss: false }); });
      const toast = screen.getByRole('status');
      act(() => { vi.advanceTimersByTime(60_000); });
      expect(toast).not.toHaveClass('akds-toast--closing');
    });

    it('respects a custom default autoDismiss on the provider', () => {
      const { show } = renderToastProvider({ autoDismiss: false });
      act(() => { show({ message: 'Provider persistent' }); });
      const toast = screen.getByRole('status');
      act(() => { vi.advanceTimersByTime(60_000); });
      expect(toast).not.toHaveClass('akds-toast--closing');
    });

    it('pauses the auto-dismiss timer on hover and resumes on leave', () => {
      const { show } = renderToastProvider();
      act(() => { show({ message: 'Hoverable', duration: 2000 }); });
      const toast = screen.getByText('Hoverable').closest('.akds-toast') as HTMLElement;

      act(() => { vi.advanceTimersByTime(1000); });
      act(() => { fireEvent.pointerEnter(toast); });
      act(() => { vi.advanceTimersByTime(5000); });
      expect(toast).not.toHaveClass('akds-toast--closing');

      act(() => { fireEvent.pointerLeave(toast); });
      act(() => { vi.advanceTimersByTime(999); });
      expect(toast).not.toHaveClass('akds-toast--closing');
      act(() => { vi.advanceTimersByTime(1); });
      expect(toast).toHaveClass('akds-toast--closing');
    });

    it('does not restart the timer on pointer leave once closing', () => {
      const { show } = renderToastProvider();
      act(() => { show({ message: 'Already closing', duration: 2000 }); });
      const toast = screen.getByText('Already closing').closest('.akds-toast') as HTMLElement;
      act(() => { vi.advanceTimersByTime(2000); });
      expect(toast).toHaveClass('akds-toast--closing');
      act(() => { fireEvent.pointerEnter(toast); });
      act(() => { fireEvent.pointerLeave(toast); });
      expect(toast).toHaveClass('akds-toast--closing');
    });
  });

  describe('screen reader live announcer', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('mounts empty polite and assertive live regions up front, before any toast shows', () => {
      renderToastProvider();
      const regions = document.querySelectorAll('.akds-toast__announcer');
      expect(regions).toHaveLength(2);
      for (const region of regions) expect(region).toHaveTextContent('');
    });

    it('announces non-destructive toasts via the polite live region', () => {
      const { show } = renderToastProvider();
      act(() => { show({ message: 'Saved successfully' }); });
      act(() => { vi.advanceTimersByTime(100); });
      expect(document.querySelector('.akds-toast__announcer[aria-live="polite"]')).toHaveTextContent('Saved successfully');
      expect(document.querySelector('.akds-toast__announcer[aria-live="assertive"]')).toHaveTextContent('');
    });

    it('announces destructive toasts via the assertive live region', () => {
      const { show } = renderToastProvider();
      act(() => { show({ emphasis: 'destructive', message: 'Something broke' }); });
      act(() => { vi.advanceTimersByTime(100); });
      expect(document.querySelector('.akds-toast__announcer[aria-live="assertive"]')).toHaveTextContent('Something broke');
      expect(document.querySelector('.akds-toast__announcer[aria-live="polite"]')).toHaveTextContent('');
    });

    it('clears the live region immediately so a repeated identical message is re-announced', () => {
      const { show } = renderToastProvider();
      act(() => { show({ message: 'Retry' }); });
      act(() => { vi.advanceTimersByTime(100); });
      const polite = document.querySelector('.akds-toast__announcer[aria-live="polite"]');
      expect(polite).toHaveTextContent('Retry');

      act(() => { show({ message: 'Retry' }); });
      // Cleared synchronously on mount, before the new debounce fires —
      // otherwise an unchanged live region won't re-announce.
      expect(polite).toHaveTextContent('');
      act(() => { vi.advanceTimersByTime(100); });
      expect(polite).toHaveTextContent('Retry');
    });
  });

  describe('axe accessibility', () => {
    it('has no violations for a default toast', async () => {
      const { show, baseElement } = renderToastProvider();
      act(() => { show({ message: 'Accessible toast' }); });
      expect(await axe(baseElement)).toHaveNoViolations();
    });

    it('has no violations for a destructive toast', async () => {
      const { show, baseElement } = renderToastProvider();
      act(() => { show({ emphasis: 'destructive', message: 'Something went wrong' }); });
      expect(await axe(baseElement)).toHaveNoViolations();
    });

    it('has no violations with multiple stacked toasts', async () => {
      const { show, baseElement } = renderToastProvider();
      act(() => { show({ message: 'First' }); });
      act(() => { show({ emphasis: 'success', message: 'Second' }); });
      expect(await axe(baseElement)).toHaveNoViolations();
    });
  });
});
