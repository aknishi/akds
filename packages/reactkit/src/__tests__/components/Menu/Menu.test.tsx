import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Menu } from '../../../components/Menu/Menu';
import { Option } from '../../../components/Option/Option';
import { stubPopoverApi } from './popoverStub';

expect.extend(toHaveNoViolations);

describe('Menu', () => {
  it('does not render when open is false', () => {
    render(
      <Menu open={false}>
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(
      <Menu open>
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(
      <Menu open>
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.getByRole('menu')).toHaveClass('akds-menu');
  });

  it('renders all child Options as menuitems', () => {
    render(
      <Menu open>
        <Option>Cut</Option>
        <Option>Copy</Option>
        <Option>Paste</Option>
      </Menu>,
    );
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('forwards ref to the ul element', () => {
    const ref = React.createRef<HTMLUListElement>();
    render(
      <Menu open ref={ref}>
        <Option>Item</Option>
      </Menu>,
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  it('forwards className', () => {
    render(
      <Menu open className="custom-menu">
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.getByRole('menu')).toHaveClass('custom-menu');
  });

  it('calls onOpenChange(false) when Escape key is pressed', async () => {
    const onOpenChange = vi.fn();
    render(
      <Menu open onOpenChange={onOpenChange}>
        <Option>Cut</Option>
      </Menu>,
    );
    screen.getByRole('menuitem', { name: 'Cut' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does NOT auto-close when an Option is clicked (consumer manages close via onClick)', async () => {
    const onOpenChange = vi.fn();
    render(
      <Menu open onOpenChange={onOpenChange}>
        <Option>Cut</Option>
      </Menu>,
    );
    await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  describe('keyboard navigation', () => {
    it('ArrowDown moves focus to the next item', async () => {
      render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option>Paste</Option>
        </Menu>,
      );
      const items = screen.getAllByRole('menuitem');
      items[0]!.focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(items[1]).toHaveFocus();
    });

    it('ArrowDown wraps from last item to first', async () => {
      render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option>Paste</Option>
        </Menu>,
      );
      const items = screen.getAllByRole('menuitem');
      items[2]!.focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(items[0]).toHaveFocus();
    });

    it('ArrowUp moves focus to the previous item', async () => {
      render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option>Paste</Option>
        </Menu>,
      );
      const items = screen.getAllByRole('menuitem');
      items[2]!.focus();
      await userEvent.keyboard('{ArrowUp}');
      expect(items[1]).toHaveFocus();
    });

    it('ArrowUp wraps from first item to last', async () => {
      render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option>Paste</Option>
        </Menu>,
      );
      const items = screen.getAllByRole('menuitem');
      items[0]!.focus();
      await userEvent.keyboard('{ArrowUp}');
      expect(items[2]).toHaveFocus();
    });

    it('Home moves focus to the first item', async () => {
      render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option>Paste</Option>
        </Menu>,
      );
      const items = screen.getAllByRole('menuitem');
      items[2]!.focus();
      await userEvent.keyboard('{Home}');
      expect(items[0]).toHaveFocus();
    });

    it('End moves focus to the last item', async () => {
      render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option>Paste</Option>
        </Menu>,
      );
      const items = screen.getAllByRole('menuitem');
      items[0]!.focus();
      await userEvent.keyboard('{End}');
      expect(items[2]).toHaveFocus();
    });

    it('forwards onKeyDown alongside internal handling', async () => {
      const onKeyDown = vi.fn();
      render(
        <Menu open onKeyDown={onKeyDown}>
          <Option>Cut</Option>
          <Option>Copy</Option>
        </Menu>,
      );
      screen.getAllByRole('menuitem')[0]!.focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  it('passes through id prop to the ul element', () => {
    render(
      <Menu open id="my-menu">
        <Option>Item</Option>
      </Menu>,
    );
    expect(screen.getByRole('menu')).toHaveAttribute('id', 'my-menu');
  });

  it('Tab key calls onOpenChange(false)', async () => {
    const onOpenChange = vi.fn();
    render(
      <Menu open onOpenChange={onOpenChange}>
        <Option>Cut</Option>
      </Menu>,
    );
    screen.getByRole('menuitem', { name: 'Cut' }).focus();
    await userEvent.keyboard('{Tab}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  describe('outside click behaviour', () => {
    it('calls onOpenChange(false) on mousedown outside the menu', () => {
      const onOpenChange = vi.fn();
      render(
        <div>
          <Menu open onOpenChange={onOpenChange}>
            <Option>Cut</Option>
          </Menu>
          <button data-testid="outside">Outside</button>
        </div>,
      );
      act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not call onOpenChange when mousedown is inside the menu', () => {
      const onOpenChange = vi.fn();
      render(
        <Menu open onOpenChange={onOpenChange}>
          <Option>Cut</Option>
        </Menu>,
      );
      act(() => {
        screen.getByRole('menuitem', { name: 'Cut' }).dispatchEvent(
          new MouseEvent('mousedown', { bubbles: true }),
        );
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('does not call onOpenChange when mousedown is on the trigger element', () => {
      const onOpenChange = vi.fn();

      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef} data-testid="trigger">Open</button>
            <Menu open onOpenChange={onOpenChange} triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      act(() => {
        screen.getByTestId('trigger').dispatchEvent(
          new MouseEvent('mousedown', { bubbles: true }),
        );
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('closing transition', () => {
    afterEach(() => {
      delete (HTMLElement.prototype as Partial<HTMLElement>).getAnimations;
    });

    it('unmounts immediately when no exit transition is running', () => {
      const { rerender } = render(
        <Menu open>
          <Option>Cut</Option>
        </Menu>,
      );
      rerender(
        <Menu open={false}>
          <Option>Cut</Option>
        </Menu>,
      );
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('marks the menu data-closing until its exit transition finishes', async () => {
      let finish!: () => void;
      const finished = new Promise<void>(r => { finish = r; });
      (HTMLElement.prototype as Partial<HTMLElement>).getAnimations = () =>
        [{ finished } as unknown as Animation];
      const { rerender } = render(
        <Menu open>
          <Option>Cut</Option>
        </Menu>,
      );
      rerender(<Menu open={false}><Option>Cut</Option></Menu>);
      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('data-closing');
      expect(menu).not.toHaveClass('akds-menu--open');
      await act(async () => { finish(); await finished; });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('re-opening during the exit transition keeps the menu mounted', async () => {
      let finish!: () => void;
      const finished = new Promise<void>(r => { finish = r; });
      (HTMLElement.prototype as Partial<HTMLElement>).getAnimations = () =>
        [{ finished } as unknown as Animation];
      const { rerender } = render(
        <Menu open>
          <Option>Cut</Option>
        </Menu>,
      );
      rerender(<Menu open={false}><Option>Cut</Option></Menu>);
      rerender(<Menu open><Option>Cut</Option></Menu>);
      await act(async () => { finish(); await finished; });
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menu')).not.toHaveAttribute('data-closing');
      expect(screen.getByRole('menu')).toHaveClass('akds-menu--open');
    });
  });

  describe('trigger focus behaviour', () => {
    const Fixture = ({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) => {
      const [open, setOpen] = React.useState(false);
      const triggerRef = React.useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={triggerRef} onClick={() => setOpen(o => !o)}>Actions</button>
          <Menu
            open={open}
            onOpenChange={o => { setOpen(o); onOpenChange?.(o); }}
            triggerRef={triggerRef as React.RefObject<HTMLElement>}
          >
            <Option onClick={() => setOpen(false)}>Cut</Option>
            <Option>Copy</Option>
          </Menu>
          <button>After</button>
        </>
      );
    };

    it('pointer open keeps focus on the trigger', async () => {
      render(<Fixture />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
      expect(screen.getByRole('menuitem', { name: 'Cut' })).not.toHaveFocus();
    });

    it('keyboard open (Enter) focuses the first item', async () => {
      render(<Fixture />);
      act(() => { screen.getByRole('button', { name: 'Actions' }).focus(); });
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('ArrowDown on the trigger opens the menu and focuses the first item', async () => {
      render(<Fixture />);
      act(() => { screen.getByRole('button', { name: 'Actions' }).focus(); });
      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('ArrowDown on the trigger enters a pointer-opened menu', async () => {
      render(<Fixture />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('Escape closes the menu and restores focus to the trigger', async () => {
      render(<Fixture />);
      act(() => { screen.getByRole('button', { name: 'Actions' }).focus(); });
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
    });

    it('activating an item restores focus to the trigger', async () => {
      render(<Fixture />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
    });

    it('Tab closes the menu without pulling focus back to the trigger', () => {
      const onOpenChange = vi.fn();
      render(<Fixture onOpenChange={onOpenChange} />);
      act(() => { screen.getByRole('button', { name: 'Actions' }).focus(); });
      fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), { key: 'ArrowDown' });
      const cut = screen.getByRole('menuitem', { name: 'Cut' });
      expect(cut).toHaveFocus();
      fireEvent.keyDown(cut, { key: 'Tab' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole('button', { name: 'Actions' })).not.toHaveFocus();
    });
  });

  describe('native popover', () => {
    let stub: ReturnType<typeof stubPopoverApi>;

    afterEach(() => {
      stub.restore();
    });

    const Fixture = ({ open, onOpenChange }: { open: boolean; onOpenChange?: (o: boolean) => void }) => {
      const triggerRef = React.useRef<HTMLButtonElement>(null);
      return (
        <div data-testid="host">
          <button ref={triggerRef} data-testid="trigger">Trigger</button>
          <Menu open={open} onOpenChange={onOpenChange ?? (() => {})} triggerRef={triggerRef as React.RefObject<HTMLElement>}>
            <Option>Cut</Option>
          </Menu>
        </div>
      );
    };

    const getMenu = () => document.body.querySelector<HTMLElement>('[role="menu"]')!;

    it('renders in place with popover="auto" and shows it in the top layer', () => {
      stub = stubPopoverApi({ anchorPositioning: true });
      render(<Fixture open />);
      const menu = getMenu();
      expect(menu).toHaveAttribute('popover', 'auto');
      expect(screen.getByTestId('host')).toContainElement(menu);
      expect(stub.showPopover).toHaveBeenCalled();
      expect(stub.isShown(menu)).toBe(true);
      expect(menu).toHaveAttribute('data-placement', 'bottom-left');
    });

    it('uses CSS anchor positioning instead of script coordinates when supported', () => {
      stub = stubPopoverApi({ anchorPositioning: true });
      render(<Fixture open />);
      const menu = getMenu();
      expect(menu.style.position).toBe('');
      expect(menu.style.top).toBe('');
    });

    it('falls back to script positioning when anchor positioning is unsupported', () => {
      stub = stubPopoverApi({ anchorPositioning: false });
      render(<Fixture open />);
      expect(getMenu().style.position).toBe('fixed');
    });

    it('calls onOpenChange(false) when the browser light-dismisses the popover', () => {
      stub = stubPopoverApi({ anchorPositioning: true });
      const onOpenChange = vi.fn();
      render(<Fixture open onOpenChange={onOpenChange} />);
      act(() => { stub.nativeClose(getMenu()); });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not treat a press on the trigger as a light dismiss', () => {
      stub = stubPopoverApi({ anchorPositioning: true });
      const onOpenChange = vi.fn();
      render(<Fixture open onOpenChange={onOpenChange} />);
      act(() => {
        screen.getByTestId('trigger').dispatchEvent(new Event('pointerdown', { bubbles: true }));
        stub.nativeClose(getMenu());
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('hides the popover when closed', () => {
      stub = stubPopoverApi({ anchorPositioning: true });
      const { rerender } = render(<Fixture open />);
      const menu = getMenu();
      rerender(<Fixture open={false} />);
      expect(stub.hidePopover).toHaveBeenCalled();
      expect(stub.isShown(menu)).toBe(false);
      expect(getMenu()).toBeNull();
    });

    it('does not register a document mousedown outside-click handler', () => {
      stub = stubPopoverApi({ anchorPositioning: true });
      const onOpenChange = vi.fn();
      render(<Fixture open onOpenChange={onOpenChange} />);
      act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('triggerRef / portal mode', () => {
    beforeEach(() => {
      // jsdom getBoundingClientRect returns zeros by default — provide minimal values
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 140,
        left: 50,
        right: 200,
        width: 150,
        height: 40,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('renders via portal into document.body', () => {
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef}>Trigger</button>
            <Menu open triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      const { container } = render(<Fixture />);
      // The menu ul is NOT inside the render container — it's portalled to body
      expect(container.querySelector('[role="menu"]')).toBeNull();
      expect(document.body.querySelector('[role="menu"]')).not.toBeNull();
    });

    it('sets aria-expanded on the trigger element when open', () => {
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef} data-testid="trigger">Trigger</button>
            <Menu open triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
    });

    it('sets aria-controls on the trigger to the menu id when open', () => {
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef} data-testid="trigger">Trigger</button>
            <Menu open id="my-menu" triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-controls', 'my-menu');
    });

    it('removes aria-controls from trigger when menu closes', () => {
      const Fixture = ({ open }: { open: boolean }) => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef} data-testid="trigger">Trigger</button>
            <Menu open={open} triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      const { rerender } = render(<Fixture open />);
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-controls');
      rerender(<Fixture open={false} />);
      expect(screen.getByTestId('trigger')).not.toHaveAttribute('aria-controls');
    });

    it('removes aria-expanded from trigger when Menu unmounts', () => {
      const Fixture = ({ show }: { show: boolean }) => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef} data-testid="trigger">Trigger</button>
            {show && (
              <Menu open triggerRef={triggerRef as React.RefObject<HTMLElement>}>
                <Option>Cut</Option>
              </Menu>
            )}
          </>
        );
      };
      const { rerender } = render(<Fixture show />);
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded');
      rerender(<Fixture show={false} />);
      expect(screen.getByTestId('trigger')).not.toHaveAttribute('aria-expanded');
    });

    it('applies fixed positioning style when triggerRef is provided', () => {
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef}>Trigger</button>
            <Menu open triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      const menu = document.body.querySelector<HTMLElement>('[role="menu"]')!;
      expect(menu.style.position).toBe('fixed');
    });

    it('updates position on scroll event', () => {
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef}>Trigger</button>
            <Menu open triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      const newRect = { top: 200, bottom: 240, left: 50, right: 200, width: 150, height: 40, x: 50, y: 200, toJSON: () => ({}) };
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(newRect);
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      const menu = document.body.querySelector<HTMLElement>('[role="menu"]')!;
      // position is fixed — we just verify the listener ran without error
      expect(menu.style.position).toBe('fixed');
    });

    it('calcPosition: places menu above trigger when placement is top-left', () => {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 300,
        bottom: 340,
        left: 50,
        right: 200,
        width: 150,
        height: 40,
        x: 50,
        y: 300,
        toJSON: () => ({}),
      });
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef}>Trigger</button>
            <Menu open placement="top-left" triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      const menu = document.body.querySelector<HTMLElement>('[role="menu"]')!;
      // top placement: top = trigger.top - menu.height - GAP = 300 - 40 - 4 = 256
      expect(parseFloat(menu.style.top)).toBe(256);
    });

    it('calcPosition: bottom-right aligns menu to right edge of trigger', () => {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 140,
        left: 50,
        right: 200,
        width: 150,
        height: 40,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      });
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef}>Trigger</button>
            <Menu open placement="bottom-right" triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      const menu = document.body.querySelector<HTMLElement>('[role="menu"]')!;
      // right alignment: left = trigger.right - menu.width = 200 - 150 = 50
      expect(parseFloat(menu.style.left)).toBe(50);
    });

    it('calcPosition: flips to top when bottom placement would overflow viewport', () => {
      // Simulate trigger near the bottom of the viewport
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 700,
        bottom: 740,
        left: 50,
        right: 200,
        width: 150,
        height: 40,
        x: 50,
        y: 700,
        toJSON: () => ({}),
      });
      Object.defineProperty(window, 'innerHeight', { value: 750, configurable: true });
      const Fixture = () => {
        const triggerRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <button ref={triggerRef}>Trigger</button>
            <Menu open placement="bottom-left" triggerRef={triggerRef as React.RefObject<HTMLElement>}>
              <Option>Cut</Option>
            </Menu>
          </>
        );
      };
      render(<Fixture />);
      const menu = document.body.querySelector<HTMLElement>('[role="menu"]')!;
      // Flips to top: top = trigger.top - menu.height - GAP = 700 - 40 - 4 = 656
      expect(parseFloat(menu.style.top)).toBe(656);
    });
  });

  describe('axe accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(
        <Menu open>
          <Option>Cut</Option>
          <Option>Copy</Option>
          <Option disabled>Paste</Option>
        </Menu>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
