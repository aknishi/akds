import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Drawer } from '../../../components/Drawer/Drawer';

expect.extend(toHaveNoViolations);

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

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose}><p>Content</p></Drawer>);
    const backdrop = document.querySelector('.akds-drawer-backdrop') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on backdrop click when disableBackdropClose is set', async () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} disableBackdropClose><p>Content</p></Drawer>);
    const backdrop = document.querySelector('.akds-drawer-backdrop') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('sets aria-modal on the panel', () => {
    render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('auto-focuses first focusable element when opened', () => {
    render(
      <Drawer open onClose={() => {}}>
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Close drawer' })).toHaveFocus();
  });

  it('sets body overflow to hidden when open', () => {
    render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when closed', () => {
    const { rerender } = render(<Drawer open onClose={() => {}}><p>Content</p></Drawer>);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Drawer open={false} onClose={() => {}}><p>Content</p></Drawer>);
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  describe('focus trap', () => {
    it('Tab from last focusable element wraps focus to first', () => {
      render(
        <Drawer open onClose={() => {}}>
          <button>Action</button>
        </Drawer>,
      );
      const closeBtn = screen.getByRole('button', { name: 'Close drawer' });
      const actionBtn = screen.getByRole('button', { name: 'Action' });
      actionBtn.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
      expect(closeBtn).toHaveFocus();
    });

    it('Shift+Tab from first focusable element wraps focus to last', () => {
      render(
        <Drawer open onClose={() => {}}>
          <button>Action</button>
        </Drawer>,
      );
      const closeBtn = screen.getByRole('button', { name: 'Close drawer' });
      const actionBtn = screen.getByRole('button', { name: 'Action' });
      closeBtn.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(actionBtn).toHaveFocus();
    });
  });

  it('forwards ref to the drawer panel', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Drawer open onClose={() => {}} ref={ref}><p>Content</p></Drawer>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'dialog');
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
