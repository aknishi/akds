import React from 'react';
import clsx from 'clsx';
import './DataViewScrollArea.css';
import type { DataViewScrollAreaProps } from './DataViewScrollArea.types';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-scroll-area');

/**
 * The bordered scroll container for a virtualized TableView. Pass its ref to
 * useVirtualizer's getScrollElement, and give it a height. It clips rows to
 * its rounded frame, shows a shadow under the sticky header once the content
 * is scrolled, and keeps the last row's border while content overflows.
 */
export const DataViewScrollArea = React.forwardRef<HTMLDivElement, DataViewScrollAreaProps>(
  function DataViewScrollArea(
    {
      className,
      onScroll,
      children,
      ...rest
    },
    ref,
  ) {
    const [scrolled, setScrolled] = React.useState(false);
    const [scrollable, setScrollable] = React.useState(false);
    const areaRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback((node: HTMLDivElement | null) => {
      areaRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [ref]);

    // The content grows as rows load without the area itself resizing, so
    // the children are observed too.
    React.useEffect(() => {
      const area = areaRef.current;
      if (!area) return undefined;
      const update = () => setScrollable(area.scrollHeight > area.clientHeight);
      update();
      if (typeof ResizeObserver === 'undefined') return undefined;
      const observer = new ResizeObserver(update);
      observer.observe(area);
      Array.from(area.children).forEach((child) => observer.observe(child));
      return () => observer.disconnect();
    }, []);

    // React skips the re-render when the value is unchanged, so this only
    // re-renders when crossing the top edge, not on every scroll event.
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrolled(e.currentTarget.scrollTop > 0);
      onScroll?.(e);
    };

    return (
      <div
        ref={setRefs}
        className={clsx(
          withBaseName(),
          { [withBaseName('scrolled')]: scrolled, [withBaseName('scrollable')]: scrollable },
          className,
        )}
        onScroll={handleScroll}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DataViewScrollArea.displayName = 'DataViewScrollArea';
