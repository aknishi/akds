import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dialog } from '../../../components/Dialog/Dialog';
import { Combobox } from '../../../components/Combobox/Combobox';

expect.extend(toHaveNoViolations);

describe('Dialog', () => {
  it('does not render when open is false', () => {
    render(<Dialog open={false} onClose={() => {}}><p>Content</p></Dialog>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<Dialog open onClose={() => {}}><p>Content</p></Dialog>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title in the header', () => {
    render(<Dialog open onClose={() => {}} title="My Dialog"><p>Content</p></Dialog>);
    expect(screen.getByText('My Dialog')).toBeInTheDocument();
  });

  it('applies base and size classes', () => {
    render(<Dialog open onClose={() => {}} size="lg"><p>Content</p></Dialog>);
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveClass('akds-dialog');
    expect(panel).toHaveClass('akds-dialog--lg');
  });

  it('default size is md', () => {
    render(<Dialog open onClose={() => {}}><p>Content</p></Dialog>);
    expect(screen.getByRole('dialog')).toHaveClass('akds-dialog--md');
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Test"><p>Content</p></Dialog>);
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose}><p>Content</p></Dialog>);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked (press and release outside)', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose}><p>Content</p></Dialog>);
    const dialog = screen.getByRole('dialog');
    fireEvent.pointerDown(dialog, { clientX: 500, clientY: 500 });
    fireEvent.pointerUp(dialog, { clientX: 500, clientY: 500 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on backdrop click when disableBackdropClose is set', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} disableBackdropClose><p>Content</p></Dialog>);
    const dialog = screen.getByRole('dialog');
    fireEvent.pointerDown(dialog, { clientX: 500, clientY: 500 });
    fireEvent.pointerUp(dialog, { clientX: 500, clientY: 500 });
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).toHaveAttribute('closedby', 'closerequest');
  });

  it('uses closedby="any" for native light dismiss by default', () => {
    render(<Dialog open onClose={() => {}}><p>Content</p></Dialog>);
    expect(screen.getByRole('dialog')).toHaveAttribute('closedby', 'any');
  });

  it('renders a native modal <dialog> without manual ARIA modal attributes', () => {
    render(<Dialog open onClose={() => {}}><p>Content</p></Dialog>);
    const dialog = screen.getByRole('dialog');
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog).toHaveAttribute('open');
    expect(dialog).not.toHaveAttribute('aria-modal');
    expect(dialog).not.toHaveAttribute('role');
  });

  it('stays open on Escape when the parent ignores onClose', async () => {
    // Escape is routed through onClose; if the parent ignores it, it stays open.
    render(<Dialog open onClose={() => {}}><p>Content</p></Dialog>);
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
  });

  it('calls onClose when the dialog closes natively (e.g. form method="dialog")', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose}><p>Content</p></Dialog>);
    (screen.getByRole('dialog') as HTMLDialogElement).close();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('associates title with dialog via aria-labelledby', () => {
    render(<Dialog open onClose={() => {}} title="My Dialog"><p>Content</p></Dialog>);
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    expect(document.getElementById(labelledById!)).toHaveTextContent('My Dialog');
  });

  it('auto-focuses first focusable element when opened', () => {
    render(
      <Dialog open onClose={() => {}}>
        <p>Content</p>
      </Dialog>,
    );
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
  });

  it('does not lock body scroll with overflow: hidden', () => {
    render(<Dialog open onClose={() => {}}><p>Content</p></Dialog>);
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('unmounts and returns focus to the trigger after closing', async () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Dialog open={open} onClose={() => setOpen(false)} title="T"><p>Content</p></Dialog>
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('forwards ref to the native dialog element', () => {
    const ref = React.createRef<HTMLDialogElement>();
    render(<Dialog open onClose={() => {}} ref={ref}><p>Content</p></Dialog>);
    expect(ref.current).toBeInstanceOf(HTMLDialogElement);
  });

  it('lets a nested open popup consume Escape before the dialog closes', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="T">
        <Combobox aria-label="Fruit" options={[{ value: 'a', label: 'Apple' }]} />
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe('axe accessibility', () => {
    it('has no violations with title', async () => {
      const { baseElement } = render(
        <Dialog open onClose={() => {}} title="Accessible Dialog">
          <p>Content here</p>
        </Dialog>,
      );
      expect(await axe(baseElement)).toHaveNoViolations();
    });

    it('has no violations without title when aria-label is provided', async () => {
      const { baseElement } = render(
        <Dialog open onClose={() => {}} aria-label="Unlabelled dialog">
          <p>Content here</p>
        </Dialog>,
      );
      expect(await axe(baseElement)).toHaveNoViolations();
    });
  });
});
