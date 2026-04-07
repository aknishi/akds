import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dialog } from '../../../components/Dialog/Dialog';

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

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose}><p>Content</p></Dialog>);
    const backdrop = document.querySelector('.akds-dialog-backdrop') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on backdrop click when disableBackdropClose is set', async () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} disableBackdropClose><p>Content</p></Dialog>);
    const backdrop = document.querySelector('.akds-dialog-backdrop') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('sets aria-modal on the dialog panel', () => {
    render(<Dialog open onClose={() => {}}><p>Content</p></Dialog>);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('associates title with dialog via aria-labelledby', () => {
    render(<Dialog open onClose={() => {}} title="My Dialog"><p>Content</p></Dialog>);
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    expect(document.getElementById(labelledById!)).toHaveTextContent('My Dialog');
  });

  it('forwards ref to the dialog panel', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Dialog open onClose={() => {}} ref={ref}><p>Content</p></Dialog>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'dialog');
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
