import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Carousel } from '../../../components/Carousel/Carousel';

expect.extend(toHaveNoViolations);

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// jsdom does not implement ResizeObserver — Carousel instantiates one on mount.
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// jsdom's getBoundingClientRect returns all zeros by default. Mock it so the
// carousel's layout math (slide width, viewport width, scroll boundaries)
// produces deterministic, testable offsets.
function mockLayout({ rootWidth, slideWidth }: { rootWidth: number; slideWidth: number }) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const width = this.classList.contains('akds-carousel__slide') ? slideWidth : rootWidth;
    return {
      width,
      height: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;
  });
}

// Carousel treats each direct JSX child as one slide, so tests build an
// array of children rather than nesting them inside a wrapper component.
function slides(count = 3) {
  return Array.from({ length: count }, (_, i) => <div key={i}>Slide {i + 1}</div>);
}

describe('Carousel', () => {
  it('renders with the region role and default accessible name', () => {
    render(<Carousel autoScroll={false}>{slides()}</Carousel>);
    expect(screen.getByRole('region', { name: 'Carousel' })).toBeInTheDocument();
  });

  it('supports a custom aria-label', () => {
    render(
      <Carousel autoScroll={false} aria-label="Featured products">
        {slides()}
      </Carousel>,
    );
    expect(screen.getByRole('region', { name: 'Featured products' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Carousel autoScroll={false}>{slides()}</Carousel>);
    const root = container.firstChild as Element;
    expect(root).toHaveClass('akds-carousel');
    expect(root).not.toHaveClass('akds-carousel--paged');
  });

  it('applies the paged modifier class when slidesPerPage is set', () => {
    const { container } = render(
      <Carousel autoScroll={false} slidesPerPage={2}>
        {slides()}
      </Carousel>,
    );
    expect(container.firstChild as Element).toHaveClass('akds-carousel--paged');
  });

  it('renders one slide group per child, labeled with its position', () => {
    render(<Carousel autoScroll={false}>{slides(3)}</Carousel>);
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(3);
    expect(groups[0]).toHaveAttribute('aria-label', '1 of 3');
    expect(groups[1]).toHaveAttribute('aria-label', '2 of 3');
    expect(groups[2]).toHaveAttribute('aria-label', '3 of 3');
  });

  it('triples the slide set when loop is enabled', () => {
    render(
      <Carousel autoScroll={false} loop>
        {slides(3)}
      </Carousel>,
    );
    // Two extra off-screen copies are rendered for seamless wraparound.
    expect(screen.getAllByRole('group')).toHaveLength(9);
    expect(screen.getAllByRole('group', { name: '1 of 3' })).toHaveLength(3);
  });

  it('renders navigation buttons by default', () => {
    render(<Carousel autoScroll={false}>{slides()}</Carousel>);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
  });

  it('hides navigation buttons when hideButtons is true', () => {
    render(
      <Carousel autoScroll={false} hideButtons>
        {slides()}
      </Carousel>,
    );
    expect(screen.queryByRole('button', { name: 'Previous slide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next slide' })).not.toBeInTheDocument();
  });

  it('does not render navigation buttons with no slides', () => {
    render(<Carousel autoScroll={false}>{[]}</Carousel>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  describe('boundary state', () => {
    beforeEach(() => {
      mockLayout({ rootWidth: 300, slideWidth: 190 });
    });

    it('disables Previous and enables Next at the start', () => {
      render(<Carousel autoScroll={false}>{slides(3)}</Carousel>);
      expect(screen.getByRole('button', { name: 'Previous slide' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Next slide' })).not.toHaveAttribute(
        'aria-disabled',
      );
    });

    it('enables Previous after navigating forward, and disables Next at the end', async () => {
      const user = userEvent.setup();
      render(<Carousel autoScroll={false}>{slides(3)}</Carousel>);
      const prev = screen.getByRole('button', { name: 'Previous slide' });
      const next = screen.getByRole('button', { name: 'Next slide' });

      await user.click(next);
      expect(prev).not.toHaveAttribute('aria-disabled');
      expect(next).not.toHaveAttribute('aria-disabled');

      await user.click(next);
      expect(prev).not.toHaveAttribute('aria-disabled');
      expect(next).toHaveAttribute('aria-disabled', 'true');
    });

    it('navigating back from the end re-enables Next', async () => {
      const user = userEvent.setup();
      render(<Carousel autoScroll={false}>{slides(3)}</Carousel>);
      const prev = screen.getByRole('button', { name: 'Previous slide' });
      const next = screen.getByRole('button', { name: 'Next slide' });

      await user.click(next);
      await user.click(next);
      expect(next).toHaveAttribute('aria-disabled', 'true');

      await user.click(prev);
      expect(next).not.toHaveAttribute('aria-disabled');
      expect(prev).not.toHaveAttribute('aria-disabled');
    });

    it('clicking a disabled Previous button does not navigate', () => {
      render(<Carousel autoScroll={false}>{slides(3)}</Carousel>);
      const prev = screen.getByRole('button', { name: 'Previous slide' });
      const next = screen.getByRole('button', { name: 'Next slide' });

      // pointer-events: none on the disabled button blocks real pointer
      // interaction in the browser; fireEvent bypasses that to also verify
      // the JS-level onClick guard.
      fireEvent.click(prev);
      expect(prev).toHaveAttribute('aria-disabled', 'true');
      expect(next).not.toHaveAttribute('aria-disabled');
    });

    it('ArrowRight on the root navigates; on a focused child button it does not', () => {
      render(<Carousel autoScroll={false}>{slides(3)}</Carousel>);
      const region = screen.getByRole('region');
      const prev = screen.getByRole('button', { name: 'Previous slide' });
      const next = screen.getByRole('button', { name: 'Next slide' });

      // Focused on the nav button itself: the keydown target isn't the root,
      // so the carousel's own arrow-key handling is skipped.
      next.focus();
      fireEvent.keyDown(next, { key: 'ArrowRight' });
      expect(prev).toHaveAttribute('aria-disabled', 'true');

      // Focused on the root region: arrow keys drive navigation.
      region.focus();
      fireEvent.keyDown(region, { key: 'ArrowRight' });
      expect(prev).not.toHaveAttribute('aria-disabled');
    });
  });

  it('forwards onKeyDown alongside its own arrow-key handling', () => {
    const onKeyDown = vi.fn();
    render(
      <Carousel autoScroll={false} onKeyDown={onKeyDown}>
        {slides()}
      </Carousel>,
    );
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('forwards mouse and focus event handlers', () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <Carousel
        autoScroll={false}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {slides()}
      </Carousel>,
    );
    const region = screen.getByRole('region');

    fireEvent.mouseEnter(region);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(region);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    fireEvent.focus(region);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(region);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('forwards additional HTML attributes to the root element', () => {
    render(
      <Carousel autoScroll={false} data-testid="carousel">
        {slides()}
      </Carousel>,
    );
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Carousel autoScroll={false} ref={ref}>
        {slides()}
      </Carousel>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('akds-carousel');
  });

  describe('auto-scroll', () => {
    beforeEach(() => {
      mockLayout({ rootWidth: 300, slideWidth: 190 });
    });

    it('advances the track transform over time', () => {
      vi.useFakeTimers();
      const { container } = render(
        <Carousel autoScrollInterval={1000}>{slides(3)}</Carousel>,
      );
      const track = container.querySelector('.akds-carousel__track') as HTMLElement;
      const initialTransform = track.style.transform;

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(track.style.transform).not.toBe(initialTransform);
    });

    it('does not move the track when autoScroll is false', () => {
      vi.useFakeTimers();
      const { container } = render(
        <Carousel autoScroll={false} autoScrollInterval={1000}>
          {slides(3)}
        </Carousel>,
      );
      const track = container.querySelector('.akds-carousel__track') as HTMLElement;
      const initialTransform = track.style.transform;

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(track.style.transform).toBe(initialTransform);
    });

    it('pauses auto-scroll on mouse enter and resumes on mouse leave', () => {
      vi.useFakeTimers();
      const { container } = render(
        <Carousel autoScrollInterval={1000}>{slides(3)}</Carousel>,
      );
      const region = screen.getByRole('region');
      const track = container.querySelector('.akds-carousel__track') as HTMLElement;

      fireEvent.mouseEnter(region);
      const pausedTransform = track.style.transform;
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(track.style.transform).toBe(pausedTransform);

      fireEvent.mouseLeave(region);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(track.style.transform).not.toBe(pausedTransform);
    });
  });

  describe('axe accessibility', () => {
    it('has no violations in the default state', async () => {
      const { container } = render(<Carousel autoScroll={false}>{slides()}</Carousel>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with loop enabled', async () => {
      const { container } = render(
        <Carousel autoScroll={false} loop>
          {slides()}
        </Carousel>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with slidesPerPage set', async () => {
      const { container } = render(
        <Carousel autoScroll={false} slidesPerPage={2}>
          {slides()}
        </Carousel>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with navigation buttons hidden', async () => {
      const { container } = render(
        <Carousel autoScroll={false} hideButtons>
          {slides()}
        </Carousel>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
