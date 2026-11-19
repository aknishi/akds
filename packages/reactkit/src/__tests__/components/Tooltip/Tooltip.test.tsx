import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tooltip } from '../../../components/Tooltip/Tooltip';

expect.extend(toHaveNoViolations);

describe('Tooltip', () => {
  it('renders the trigger child in the document', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
  });

  it('renders the tooltip element with role="tooltip"', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
  });

  it('tooltip is not visible by default', () => {
    render(
      <Tooltip content="Hidden tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).not.toHaveClass('akds-tooltip--visible');
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hover tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveClass('akds-tooltip--visible');
  });

  it('hides tooltip when mouse leaves (after a short hover grace period)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hover tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    await user.unhover(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveClass('akds-tooltip--visible');
    });
  });

  describe('hoverable (WCAG 1.4.13)', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('stays open while the pointer moves from the trigger onto the tooltip', () => {
      render(
        <Tooltip content="Hoverable tip">
          <button>Trigger</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole('button');
      fireEvent.mouseEnter(trigger);
      const tooltip = screen.getByRole('tooltip');
      fireEvent.mouseLeave(trigger);
      fireEvent.mouseEnter(tooltip);
      act(() => { vi.advanceTimersByTime(1000); });
      expect(tooltip).toHaveClass('akds-tooltip--visible');

      fireEvent.mouseLeave(tooltip);
      act(() => { vi.advanceTimersByTime(100); });
      expect(tooltip).not.toHaveClass('akds-tooltip--visible');
    });

    it('stays open on mouse leave while the trigger still has keyboard focus', () => {
      render(
        <Tooltip content="Focused tip">
          <button>Trigger</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole('button');
      act(() => { trigger.focus(); });
      fireEvent.mouseEnter(trigger);
      fireEvent.mouseLeave(trigger);
      act(() => { vi.advanceTimersByTime(1000); });
      expect(screen.getByRole('tooltip')).toHaveClass('akds-tooltip--visible');
    });
  });

  it('dismisses on Escape without moving hover or focus', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Escapable tip" onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    const trigger = screen.getByRole('button');
    expect(screen.getByRole('tooltip')).toHaveClass('akds-tooltip--visible');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveClass('akds-tooltip--visible');
    expect(trigger).toHaveFocus();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('merges with an existing aria-describedby on the child instead of replacing it', () => {
    render(
      <>
        <p id="hint">Extra hint</p>
        <Tooltip content="Merged tip">
          <button aria-describedby="hint">Trigger</button>
        </Tooltip>
      </>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', `hint ${tooltip.id}`);
  });

  describe('top layer (popover="hint")', () => {
    const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
    let showPopover: ReturnType<typeof vi.fn>;
    let hidePopover: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      vi.useFakeTimers();
      showPopover = vi.fn();
      hidePopover = vi.fn();
      Object.defineProperty(proto, 'popover', { configurable: true, value: null, writable: true });
      proto.showPopover = showPopover;
      proto.hidePopover = hidePopover;
    });

    afterEach(() => {
      vi.useRealTimers();
      delete proto.popover;
      delete proto.showPopover;
      delete proto.hidePopover;
    });

    it('renders as a hint popover and shows/hides it with the tooltip', () => {
      const { rerender } = render(
        <Tooltip content="Popover tip" open={false}>
          <button>Trigger</button>
        </Tooltip>,
      );
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveAttribute('popover', 'hint');

      rerender(
        <Tooltip content="Popover tip" open>
          <button>Trigger</button>
        </Tooltip>,
      );
      expect(showPopover).toHaveBeenCalledTimes(1);

      // jsdom never matches :popover-open, so pretend it is open for the hide path.
      const matches = vi.spyOn(tooltip, 'matches').mockReturnValue(true);
      rerender(
        <Tooltip content="Popover tip" open={false}>
          <button>Trigger</button>
        </Tooltip>,
      );
      // Exit transition plays first, then the popover leaves the top layer.
      expect(hidePopover).not.toHaveBeenCalled();
      act(() => { vi.advanceTimersByTime(160); });
      expect(hidePopover).toHaveBeenCalledTimes(1);
      matches.mockRestore();
    });

    it('syncs state when the browser closes the popover (light dismiss)', () => {
      const onOpenChange = vi.fn();
      render(
        <Tooltip content="Light dismiss tip" onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Tooltip>,
      );
      fireEvent.mouseEnter(screen.getByRole('button'));
      // jsdom's UA sheet hides [popover] (it never matches :popover-open).
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveClass('akds-tooltip--visible');
      act(() => {
        tooltip.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
      });
      expect(tooltip).not.toHaveClass('akds-tooltip--visible');
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('uses a per-instance anchor name without colons', () => {
      render(
        <Tooltip content="Anchored tip">
          <button>Trigger</button>
        </Tooltip>,
      );
      const wrapper = screen.getByRole('button').parentElement!;
      const anchor = wrapper.style.getPropertyValue('--akds-tooltip-anchor');
      expect(anchor).toMatch(/^--akds-tooltip-/);
      expect(anchor).not.toContain(':');
    });
  });

  it('does not set the popover attribute when the Popover API is unavailable', () => {
    render(
      <Tooltip content="Fallback tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveAttribute('popover');
  });

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Focus tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveClass('akds-tooltip--visible');
  });

  it('hides tooltip on blur', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Focus tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveClass('akds-tooltip--visible');
  });

  it('links trigger to tooltip via aria-describedby', () => {
    render(
      <Tooltip content="Described tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button');
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('applies placement class', () => {
    render(
      <Tooltip content="Right tip" placement="right">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('akds-tooltip--right');
  });

  it('defaults to top placement', () => {
    render(
      <Tooltip content="Top tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass('akds-tooltip--top');
  });

  it('renders visible when open is controlled true', () => {
    render(
      <Tooltip content="Controlled tip" open>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('akds-tooltip--visible');
  });

  it('renders hidden when open is controlled false, ignoring hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Controlled tip" open={false}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveClass('akds-tooltip--visible');
  });

  it('calls onOpenChange on hover/unhover without managing its own visibility when controlled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Controlled tip" open={false} onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('tooltip', { hidden: true })).not.toHaveClass('akds-tooltip--visible');
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(
        <Tooltip content="Accessible tip">
          <button>Trigger</button>
        </Tooltip>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when visible', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Accessible tip">
          <button>Trigger</button>
        </Tooltip>,
      );
      await user.hover(screen.getByRole('button'));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
