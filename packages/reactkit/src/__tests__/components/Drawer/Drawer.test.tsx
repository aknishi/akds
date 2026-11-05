import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Drawer } from '../../../components/Drawer/Drawer';
import { ToastProvider } from '../../../components/Toast/Toast';
import { useToast } from '../../../components/Toast/useToast';
import { stubPopoverApi } from '../Menu/popoverStub';

expect.extend(toHaveNoViolations);

// jsdom has no layout, scrolling or IntersectionObserver. Capture observers so
// tests can report the sheet's visibility, and record scrollTo calls.
let observers: { callback: IntersectionObserverCallback; observer: IntersectionObserver }[] = [];
let scrollTo: ReturnType<typeof vi.fn>;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observers.push({ callback, observer: this as unknown as IntersectionObserver });
  }
  observe() {}
  unobserve() {}
  disconnect() {
    observers = observers.filter((o) => o.observer !== (this as unknown));
  }
  takeRecords() {
    return [];
  }
}

/** Report the sheet's visible ratio (1 = fully open, 0 = fully swiped away). */
function reportSheet(intersectionRatio: number) {
  act(() => {
    for (const { callback, observer } of observers) {
      callback([{ intersectionRatio } as IntersectionObserverEntry], observer);
    }
  });
}

/** Give the scroller a horizontal scroll range so slide-outs have somewhere to go. */
function giveScrollRange(dialog: HTMLElement, range = 360) {
  const scroller = dialog.querySelector('.akds-drawer__scroller')!;
  Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 1000 });
  Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: 1000 + range });
  return scroller;
}

beforeEach(() => {
  observers = [];
  scrollTo = vi.fn();
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo;
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete (Element.prototype as Partial<Element>).scrollTo;
});

function Harness({ keepOpen = false, onClose }: { keepOpen?: boolean; onClose?: () => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Drawer
        open={open}
        onClose={() => {
          onClose?.();
          if (!keepOpen) setOpen(false);
        }}
        title="T"
      >
        <p>Content</p>
      </Drawer>
    </>
  );
}

describe('Drawer', () => {
  it('does not render when open is false', () => {
    render(<Drawer open={false} onClose={() => {}}><p>Content</p></Drawer>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title in the header', () => {
    render(<Drawer open onClose={() => {}} title="Settings"><p>Content</p></Drawer>);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('applies base and side classes', () => {
    render(<Drawer open onClose={() => {}} side="left"><p>Content</p></Drawer>);
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveClass('akds-drawer');
    expect(panel).toHaveClass('akds-drawer--left');
  });

  it('default side is right', () => {
    render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    expect(screen.getByRole('dialog')).toHaveClass('akds-drawer--right');
  });

  it('applies size class', () => {
    render(<Drawer open onClose={() => {}} size="lg"><p>Content</p></Drawer>);
    expect(screen.getByRole('dialog')).toHaveClass('akds-drawer--lg');
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="Test"><p>Content</p></Drawer>);
    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose}><p>Content</p></Drawer>);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the sheet inside a scroll-snap scroller', () => {
    render(<Drawer open onClose={() => {}} title="T"><p>Content</p></Drawer>);
    const drawer = screen.getByRole('dialog');
    const scroller = drawer.querySelector(':scope > .akds-drawer__scroller');
    expect(scroller).not.toBeNull();
    const sheet = scroller!.querySelector(':scope > .akds-drawer__sheet');
    expect(sheet).toContainElement(screen.getByText('Content'));
  });

  it('does not use closedby="any" (backdrop taps are handled in the dialog)', () => {
    render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    expect(screen.getByRole('dialog')).toHaveAttribute('closedby', 'closerequest');
  });

  it('calls onClose when the backdrop area is tapped (press and release outside the sheet)', () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose}><p>Content</p></Drawer>);
    const scroller = screen.getByRole('dialog').querySelector('.akds-drawer__scroller')!;
    fireEvent.pointerDown(scroller);
    fireEvent.click(scroller);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for a tap inside the sheet', () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose}><p>Content</p></Drawer>);
    const content = screen.getByText('Content');
    fireEvent.pointerDown(content);
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not treat a tap on a toast shown over the drawer as a backdrop tap', async () => {
    // jsdom lacks the layout APIs ToastCard uses to detect wrapping.
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    Range.prototype.getClientRects = vi.fn().mockReturnValue([{}]);
    const popover = stubPopoverApi();
    try {
      const onClose = vi.fn();
      let show: ((o: { message: string }) => string) | undefined;
      const Grab = () => { show = useToast().show; return null; };
      render(
        <ToastProvider>
          <Grab />
          <Drawer open onClose={onClose}><p>Content</p></Drawer>
        </ToastProvider>,
      );
      await act(async () => { show!({ message: 'Saved' }); });
      const dialog = screen.getByRole('dialog');
      const dismiss = document.querySelector<HTMLElement>('button[aria-label="Dismiss notification"]')!;
      expect(dialog).toContainElement(dismiss);
      fireEvent.pointerDown(dismiss);
      fireEvent.click(dismiss);
      expect(onClose).not.toHaveBeenCalled();
    } finally {
      popover.restore();
      vi.unstubAllGlobals();
    }
  });

  it('does not call onClose when a press starts in the sheet and ends outside it', () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose}><p>Content</p></Drawer>);
    fireEvent.pointerDown(screen.getByText('Content'));
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose on backdrop tap when disableBackdropClose is set', () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} disableBackdropClose><p>Content</p></Drawer>);
    const drawer = screen.getByRole('dialog');
    fireEvent.pointerDown(drawer);
    fireEvent.click(drawer);
    expect(onClose).not.toHaveBeenCalled();
  });

  describe('swipe to dismiss', () => {
    it('calls onClose once the sheet is swiped fully out after being open', () => {
      const onClose = vi.fn();
      render(<Drawer open onClose={onClose}><p>Content</p></Drawer>);
      reportSheet(1);
      reportSheet(0.5);
      expect(onClose).not.toHaveBeenCalled();
      reportSheet(0);
      expect(onClose).toHaveBeenCalledTimes(1);
      reportSheet(0);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('ignores the hidden report from before the drawer has slid in', () => {
      const onClose = vi.fn();
      render(<Drawer open onClose={onClose}><p>Content</p></Drawer>);
      reportSheet(0);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('still swipes to dismiss when disableBackdropClose is set', () => {
      const onClose = vi.fn();
      render(<Drawer open onClose={onClose} disableBackdropClose><p>Content</p></Drawer>);
      reportSheet(1);
      reportSheet(0);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('unmounts after a swipe-out when the parent closes it', async () => {
      render(<Harness />);
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      reportSheet(1);
      reportSheet(0);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('snaps back open when the parent keeps it open after a swipe-out', async () => {
      const onClose = vi.fn();
      render(<Harness keepOpen onClose={onClose} />);
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      giveScrollRange(screen.getByRole('dialog'));
      reportSheet(1);
      scrollTo.mockClear();
      reportSheet(0);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('dialog')).toHaveAttribute('open');
      // Right side: the open stop is the end of the scroll range.
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 360, behavior: 'auto' });
      // Once back open, a second swipe-out asks again.
      reportSheet(1);
      reportSheet(0);
      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });

  it('slides out before closing: stays mounted until the sheet is fully gone', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    giveScrollRange(dialog);
    reportSheet(1);
    scrollTo.mockClear();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    // Scrolled to the closed stop (scroll 0 for a right drawer), still open.
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'auto' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('open');
    reportSheet(0.4);
    expect(dialog).toBeInTheDocument();
    reportSheet(0);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    // The slide-out finishing is not a second dismissal.
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('scrolls along the y axis for top and bottom drawers', () => {
    render(<Drawer open onClose={() => {}} side="bottom"><p>Content</p></Drawer>);
    const calls = scrollTo.mock.calls.map(([options]) => options as ScrollToOptions);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every((o) => 'top' in o && !('left' in o))).toBe(true);
  });

  it('renders a native modal <dialog> without manual ARIA modal attributes', () => {
    render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    const drawer = screen.getByRole('dialog');
    expect(drawer.tagName).toBe('DIALOG');
    expect(drawer).toHaveAttribute('open');
    expect(drawer).not.toHaveAttribute('aria-modal');
  });

  it('accepts aria-label when there is no title', () => {
    render(<Drawer open onClose={() => {}} aria-label="Filters"><p>Content</p></Drawer>);
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
  });

  it('auto-focuses first focusable element when opened', () => {
    render(
      <Drawer open onClose={() => {}}>
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Close drawer' })).toHaveFocus();
  });

  it('does not lock body scroll with overflow: hidden', () => {
    render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('unmounts and returns focus to the trigger after closing', async () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Drawer open={open} onClose={() => setOpen(false)} title="T"><p>Content</p></Drawer>
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('forwards ref to the native dialog element', () => {
    const ref = React.createRef<HTMLDialogElement>();
  describe('focus return', () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Drawer open={open} onClose={() => setOpen(false)}>
            <p>Content</p>
          </Drawer>
        </>
      );
    }

    it('returns focus to the opener when closed with the close button', async () => {
      const user = userEvent.setup();
      render(<Harness />);
      const opener = screen.getByRole('button', { name: 'Open' });
      await user.click(opener);
      expect(screen.getByRole('button', { name: 'Close drawer' })).toHaveFocus();
      await user.click(screen.getByRole('button', { name: 'Close drawer' }));
      expect(opener).toHaveFocus();
    });

    it('returns focus to the opener when closed with Escape', async () => {
      const user = userEvent.setup();
      render(<Harness />);
      const opener = screen.getByRole('button', { name: 'Open' });
      await user.click(opener);
      await user.keyboard('{Escape}');
      expect(opener).toHaveFocus();
    });

    it('returns focus when the open prop becomes false', () => {
      const opener = document.createElement('button');
      document.body.appendChild(opener);
      opener.focus();
      const { rerender } = render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
      expect(opener).not.toHaveFocus();
      rerender(<Drawer open={false} onClose={() => {}}><p>Content</p></Drawer>);
      expect(opener).toHaveFocus();
      opener.remove();
    });

    it('does not throw when the opener was removed while open', () => {
      const opener = document.createElement('button');
      document.body.appendChild(opener);
      opener.focus();
      const { rerender } = render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
      opener.remove();
      expect(() => rerender(<Drawer open={false} onClose={() => {}}><p>Content</p></Drawer>)).not.toThrow();
    });
  });

  it('forwards ref to the drawer panel', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Drawer open onClose={() => {}} ref={ref}><p>Content</p></Drawer>);
    expect(ref.current).toBeInstanceOf(HTMLDialogElement);
  });

  describe('axe accessibility', () => {
    it('has no violations with title', async () => {
      const { baseElement } = render(
        <Drawer open onClose={() => {}} title="Settings Panel">
          <p>Content here</p>
        </Drawer>,
      );
      expect(await axe(baseElement)).toHaveNoViolations();
    });

    it('has no violations for each side', async () => {
      for (const side of ['left', 'right', 'top', 'bottom'] as const) {
        const { baseElement, unmount } = render(
          <Drawer open onClose={() => {}} side={side} title="Panel">
            <p>Content</p>
          </Drawer>,
        );
        expect(await axe(baseElement)).toHaveNoViolations();
        unmount();
      }
    });
  });
});
