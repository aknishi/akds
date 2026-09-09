import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThinkingState } from '../../../components/ThinkingState/ThinkingState';

expect.extend(toHaveNoViolations);

const REASONING_LABELS = ['Thinking', 'Analyzing your request', 'Forming a response'];

describe('ThinkingState', () => {
  it('renders with the correct role and default label', () => {
    render(<ThinkingState />);
    expect(screen.getByRole('status')).toHaveTextContent('Thinking');
  });

  it('renders a custom label', () => {
    render(<ThinkingState label="Reasoning" />);
    expect(screen.getByRole('status')).toHaveTextContent('Reasoning');
  });

  it('applies default classes', () => {
    render(<ThinkingState />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('akds-thinking-state');
    expect(el).toHaveClass('akds-thinking-state--active');
  });

  it('does not apply the active class when active is false', () => {
    render(<ThinkingState active={false} />);
    expect(screen.getByRole('status')).not.toHaveClass('akds-thinking-state--active');
  });

  it('renders the loading spinner while active', () => {
    const { container } = render(<ThinkingState />);
    expect(container.querySelector('.akds-thinking-state__spinner')).toBeInTheDocument();
  });

  it('does not render the loading spinner once finished (active is false)', () => {
    const { container } = render(<ThinkingState active={false} />);
    expect(container.querySelector('.akds-thinking-state__spinner')).not.toBeInTheDocument();
  });

  it('does not render a trigger button when there are no children', () => {
    render(<ThinkingState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a disclosure trigger when children are provided', () => {
    render(<ThinkingState>Reasoning trace</ThinkingState>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('is collapsed by default when uncontrolled', () => {
    render(<ThinkingState>Reasoning trace</ThinkingState>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('respects defaultExpanded', () => {
    render(<ThinkingState defaultExpanded>Reasoning trace</ThinkingState>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles expanded state on click when uncontrolled', async () => {
    render(<ThinkingState>Reasoning trace</ThinkingState>);
    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onExpandedChange with the next value', async () => {
    const onExpandedChange = vi.fn();
    render(<ThinkingState onExpandedChange={onExpandedChange}>Reasoning trace</ThinkingState>);
    await userEvent.click(screen.getByRole('button'));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it('controlled: expanded prop overrides internal state', async () => {
    const onExpandedChange = vi.fn();
    render(
      <ThinkingState expanded={false} onExpandedChange={onExpandedChange}>
        Reasoning trace
      </ThinkingState>,
    );
    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('associates the panel with the trigger via aria-controls/aria-labelledby', () => {
    render(<ThinkingState defaultExpanded>Reasoning trace</ThinkingState>);
    const trigger = screen.getByRole('button');
    const panel = screen.getByRole('region');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('renders children inside the panel', () => {
    render(<ThinkingState defaultExpanded>Reasoning trace</ThinkingState>);
    expect(screen.getByRole('region')).toHaveTextContent('Reasoning trace');
  });

  it('forwards additional HTML attributes', () => {
    render(<ThinkingState data-testid="thinking" />);
    expect(screen.getByTestId('thinking')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ThinkingState ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('sets the background-color custom property when backgroundColor is passed', () => {
    render(<ThinkingState backgroundColor="#1e1e1e" />);
    expect(screen.getByRole('status')).toHaveStyle({ '--akds-thinking-state-background-color': '#1e1e1e' });
  });

  it('does not set the background-color custom property when backgroundColor is omitted', () => {
    render(<ThinkingState />);
    const style = screen.getByRole('status').style;
    expect(style.getPropertyValue('--akds-thinking-state-background-color')).toBe('');
  });

  it('merges backgroundColor with an explicit style prop', () => {
    render(<ThinkingState backgroundColor="#1e1e1e" style={{ marginTop: 4 }} />);
    const status = screen.getByRole('status');
    expect(status).toHaveStyle({ '--akds-thinking-state-background-color': '#1e1e1e', marginTop: '4px' });
  });

  describe('cycling labels', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders the first label immediately', () => {
      render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      expect(screen.getByRole('status')).toHaveTextContent('Thinking');
    });

    it('applies the cycling class so CSS can suppress the shimmer', () => {
      render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      expect(screen.getByRole('status')).toHaveClass('akds-thinking-state--cycling');
    });

    it('does not apply the cycling class for a static label', () => {
      render(<ThinkingState />);
      expect(screen.getByRole('status')).not.toHaveClass('akds-thinking-state--cycling');
    });

    it('ignores label when labels is provided', () => {
      render(<ThinkingState label="Ignored" labels={REASONING_LABELS} labelInterval={1000} />);
      expect(screen.getByRole('status')).toHaveTextContent('Thinking');
    });

    it('advances to the next label after labelInterval', () => {
      render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      act(() => { vi.advanceTimersByTime(1000); });
      expect(screen.getByRole('status')).toHaveTextContent('Analyzing your request');
    });

    it('holds on the last label instead of looping', () => {
      render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      act(() => { vi.advanceTimersByTime(1000 * 5); });
      expect(screen.getByRole('status')).toHaveTextContent('Forming a response');
    });

    it('does not advance when active is false', () => {
      render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} active={false} />);
      act(() => { vi.advanceTimersByTime(1000 * 5); });
      expect(screen.getByRole('status')).toHaveTextContent('Thinking');
    });

    it('resets to the first label when the labels array changes', () => {
      const { rerender } = render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      act(() => { vi.advanceTimersByTime(1000); });
      expect(screen.getByRole('status')).toHaveTextContent('Analyzing your request');

      rerender(<ThinkingState labels={['Thinking', 'Reviewing new context']} labelInterval={1000} />);
      expect(screen.getByRole('status')).toHaveTextContent('Thinking');
    });

    it('does not render a peeling overlay on initial mount', () => {
      const { container } = render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      expect(container.querySelector('.akds-thinking-state__label--peeling')).not.toBeInTheDocument();
    });

    it('does not render a cursor on initial mount', () => {
      const { container } = render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      expect(container.querySelector('.akds-thinking-state__label-cursor')).not.toBeInTheDocument();
    });

    it('renders an aria-hidden cursor alongside the peeling overlay during the transition', () => {
      const { container } = render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      act(() => { vi.advanceTimersByTime(1000); });

      const cursor = container.querySelector('.akds-thinking-state__label-cursor');
      expect(cursor).toBeInTheDocument();
      expect(cursor).toHaveAttribute('aria-hidden', 'true');
    });

    it('removes the cursor once the wipe animation ends', () => {
      const { container } = render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      act(() => { vi.advanceTimersByTime(1000); });

      const peeling = container.querySelector('.akds-thinking-state__label--peeling')!;
      act(() => { peeling.dispatchEvent(new Event('webkitAnimationEnd', { bubbles: true })); });

      expect(container.querySelector('.akds-thinking-state__label-cursor')).not.toBeInTheDocument();
    });

    it('wipes the previous label away in an aria-hidden overlay during the transition', () => {
      const { container } = render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      act(() => { vi.advanceTimersByTime(1000); });

      const peeling = container.querySelector('.akds-thinking-state__label--peeling');
      expect(peeling).toHaveTextContent('Thinking');
      expect(peeling).toHaveAttribute('aria-hidden', 'true');
    });

    it('removes the peeling overlay once its wipe animation ends', () => {
      const { container } = render(<ThinkingState labels={REASONING_LABELS} labelInterval={1000} />);
      act(() => { vi.advanceTimersByTime(1000); });

      const peeling = container.querySelector('.akds-thinking-state__label--peeling')!;
      // jsdom has no AnimationEvent, so React falls back to the vendor-prefixed
      // "webkitAnimationEnd" native event name it detects from the style object —
      // fireEvent.animationEnd (plain "animationend") never reaches the handler here.
      act(() => { peeling.dispatchEvent(new Event('webkitAnimationEnd', { bubbles: true })); });

      expect(container.querySelector('.akds-thinking-state__label--peeling')).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('Analyzing your request');
    });
  });

  describe('axe accessibility', () => {
    it('has no violations for the standalone indicator', async () => {
      const { container } = render(<ThinkingState />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations for the standalone indicator when inactive', async () => {
      const { container } = render(<ThinkingState active={false} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with a cycling labels sequence', async () => {
      const { container } = render(<ThinkingState labels={REASONING_LABELS} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations for the collapsed disclosure', async () => {
      const { container } = render(<ThinkingState>Reasoning trace</ThinkingState>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations for the expanded disclosure', async () => {
      const { container } = render(<ThinkingState defaultExpanded>Reasoning trace</ThinkingState>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
