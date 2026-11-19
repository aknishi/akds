import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DataViewScrollArea } from '../../DataViewScrollArea/DataViewScrollArea';

expect.extend(toHaveNoViolations);

const scrollTo = (el: HTMLElement, top: number) => {
  el.scrollTop = top;
  fireEvent.scroll(el);
};

describe('DataViewScrollArea', () => {
  it('renders its children in a scroll container with the base class', () => {
    render(<DataViewScrollArea data-testid="area"><p>Rows</p></DataViewScrollArea>);
    expect(screen.getByTestId('area')).toHaveClass('akds-dataview-scroll-area');
    expect(screen.getByText('Rows')).toBeInTheDocument();
  });

  it('is a region keyboard users can tab to, named by aria-label', () => {
    render(<DataViewScrollArea aria-label="Orders"><p>Rows</p></DataViewScrollArea>);
    expect(screen.getByRole('region', { name: 'Orders' })).toHaveAttribute('tabindex', '0');
  });

  it('adds the scrolled modifier only while scrolled away from the top', () => {
    render(<DataViewScrollArea data-testid="area"><p>Rows</p></DataViewScrollArea>);
    const area = screen.getByTestId('area');
    expect(area).not.toHaveClass('akds-dataview-scroll-area--scrolled');
    scrollTo(area, 120);
    expect(area).toHaveClass('akds-dataview-scroll-area--scrolled');
    scrollTo(area, 0);
    expect(area).not.toHaveClass('akds-dataview-scroll-area--scrolled');
  });

  describe('scrollable modifier', () => {
    // jsdom has no layout, so heights are stubbed and ResizeObserver is faked.
    let resizeCallback: (() => void) | undefined;
    const disconnect = vi.fn();

    beforeEach(() => {
      vi.stubGlobal('ResizeObserver', class {
        constructor(callback: () => void) {
          resizeCallback = callback;
        }
        observe() {}
        disconnect = disconnect;
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    const setHeights = (el: HTMLElement, scrollHeight: number, clientHeight: number) => {
      Object.defineProperty(el, 'scrollHeight', { configurable: true, value: scrollHeight });
      Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight });
    };

    it('is added only while the content overflows', () => {
      const { unmount } = render(<DataViewScrollArea data-testid="area"><p>Rows</p></DataViewScrollArea>);
      const area = screen.getByTestId('area');
      expect(area).not.toHaveClass('akds-dataview-scroll-area--scrollable');

      setHeights(area, 900, 480);
      act(() => resizeCallback?.());
      expect(area).toHaveClass('akds-dataview-scroll-area--scrollable');

      setHeights(area, 480, 480);
      act(() => resizeCallback?.());
      expect(area).not.toHaveClass('akds-dataview-scroll-area--scrollable');

      unmount();
      expect(disconnect).toHaveBeenCalled();
    });
  });

  it('still calls a passed onScroll', () => {
    const onScroll = vi.fn();
    render(<DataViewScrollArea data-testid="area" onScroll={onScroll}><p>Rows</p></DataViewScrollArea>);
    scrollTo(screen.getByTestId('area'), 40);
    expect(onScroll).toHaveBeenCalledTimes(1);
  });

  it('supports a function ref', () => {
    let node: HTMLDivElement | null = null;
    render(<DataViewScrollArea ref={(el) => { node = el; }}><p>Rows</p></DataViewScrollArea>);
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it('merges className and forwards attributes and ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <DataViewScrollArea ref={ref} className="custom" style={{ height: '200px' }} aria-label="Orders">
        <p>Rows</p>
      </DataViewScrollArea>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('akds-dataview-scroll-area', 'custom');
    expect(ref.current).toHaveAttribute('aria-label', 'Orders');
    expect(ref.current).toHaveStyle({ height: '200px' });
  });

  describe('axe accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(<DataViewScrollArea><button type="button">Row action</button></DataViewScrollArea>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
