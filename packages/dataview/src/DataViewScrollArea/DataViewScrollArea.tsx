import React from 'react';
import clsx from 'clsx';
import './DataViewScrollArea.css';
import type { DataViewScrollAreaProps } from './DataViewScrollArea.types';
import { makePrefixer } from '../utils';
import { supportsCssScrollShadows } from '../TableView/pinning';

const withBaseName = makePrefixer('akds-dataview-scroll-area');

/**
 * The bordered scroll container for a virtualized TableView. Pass its ref to
 * useVirtualizer's getScrollElement, and give it a height. It clips rows to
 * its rounded frame, shows a shadow under the sticky header once the content
 * is scrolled, and keeps the last row's border while content overflows.
 * It's a region keyboard users can tab to and scroll; name it with
 * `aria-label` or `aria-labelledby`.
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

    // Fallback for browsers that can't show the header shadow in CSS (see
    // TableView.css). React skips the re-render when the value is unchanged,
    // so this only re-renders when crossing the top edge.
    const cssShadows = React.useMemo(supportsCssScrollShadows, []);
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (!cssShadows) setScrolled(e.currentTarget.scrollTop > 0);
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
        role="region"
        tabIndex={0}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DataViewScrollArea.displayName = 'DataViewScrollArea';
