import React from 'react';

/** Pin keys for TableView's own columns; prefixed so they can't clash with a team's column ids. */
export const SELECT_PIN_KEY = '__select';
export const ACTIONS_PIN_KEY = '__actions';

export type PinSide = 'left' | 'right';

/** Keys in usePinnedOffsets' result for the total pinned width on each side. */
export const PINNED_START = '__pinnedStart';
export const PINNED_END = '__pinnedEnd';

/**
 * Measures the rendered width of each pinned header cell and returns how far
 * each pinned column sits from its edge (the sum of the widths before it).
 * Measuring keeps the table's automatic column sizing, so teams never have
 * to set column widths for pinning to work.
 */
export function usePinnedOffsets(
  tableRef: React.RefObject<HTMLTableElement>,
  leftKeys: string[],
  rightKeys: string[],
) {
  // Each pinned key's offset from its edge, plus the total width pinned on
  // each side under PINNED_START and PINNED_END.
  const [offsets, setOffsets] = React.useState<Record<string, number>>({});
  const leftSignature = leftKeys.join('|');
  const rightSignature = rightKeys.join('|');

  // Layout effect, so pinned cells are placed before the first paint.
  React.useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return undefined;
    const widthOf = (key: string) =>
      table.querySelector(`thead [data-pin-key="${key}"]`)?.getBoundingClientRect().width ?? 0;

    const measure = () => {
      const next: Record<string, number> = {};
      let left = 0;
      leftKeys.forEach((key) => {
        next[key] = left;
        left += widthOf(key);
      });
      let right = 0;
      [...rightKeys].reverse().forEach((key) => {
        next[key] = right;
        right += widthOf(key);
      });
      next[PINNED_START] = left;
      next[PINNED_END] = right;
      setOffsets((prev) => (shallowEqual(prev, next) ? prev : next));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    table.querySelectorAll('thead [data-pin-key]').forEach((cell) => observer.observe(cell));
    return () => observer.disconnect();
    // The signatures stand in for the key arrays, which are new every render.
  }, [tableRef, leftSignature, rightSignature]);

  return offsets;
}

/**
 * Whether CSS alone can show the scroll shadows: scroll-state container
 * queries, or scroll-driven animations as their fallback (see
 * TableView.css). Read on each call, since it's only used in effects.
 */
export function supportsCssScrollShadows() {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
    && (CSS.supports('container-type', 'scroll-state') || CSS.supports('animation-timeline', 'scroll()'));
}

/**
 * Tracks whether the table is scrolled away from its start and end, so the
 * pinned columns only cast a shadow when content is actually hidden beneath
 * them. Only a fallback for browsers that can't do it in CSS.
 */
export function useHorizontalScrollEdges(tableRef: React.RefObject<HTMLTableElement>) {
  const [edges, setEdges] = React.useState({ start: false, end: false });

  React.useEffect(() => {
    if (supportsCssScrollShadows()) return undefined;
    const table = tableRef.current;
    const scroller = table ? findHorizontalScroller(table) : null;
    if (!table || !scroller) return undefined;

    const update = () => {
      const start = scroller.scrollLeft > 0;
      // 1px of tolerance for fractional widths.
      const end = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(scroller);
    observer?.observe(table);
    return () => {
      scroller.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [tableRef]);

  return edges;
}

/**
 * Keeps keyboard focus from landing under the pinned columns or, in a
 * DataViewScrollArea, the sticky header (WCAG 2.4.11 Focus Not Obscured).
 * Sets the pinned widths and the header height as custom properties on the
 * scroll container, which TableView.css turns into its scroll-padding.
 */
export function useScrollerPadding(
  tableRef: React.RefObject<HTMLTableElement>,
  { start, end, stickyHeader }: { start: number; end: number; stickyHeader: boolean },
) {
  React.useLayoutEffect(() => {
    const table = tableRef.current;
    const scroller = table ? findHorizontalScroller(table) : null;
    if (!table || !scroller) return undefined;
    scroller.style.setProperty('--akds-dataview-scroll-padding-start', `${start}px`);
    scroller.style.setProperty('--akds-dataview-scroll-padding-end', `${end}px`);
    return () => {
      scroller.style.removeProperty('--akds-dataview-scroll-padding-start');
      scroller.style.removeProperty('--akds-dataview-scroll-padding-end');
    };
  }, [tableRef, start, end]);

  React.useLayoutEffect(() => {
    const table = tableRef.current;
    const scroller = table ? findHorizontalScroller(table) : null;
    const thead = table?.tHead;
    if (!stickyHeader || !scroller || !thead) return undefined;
    const measure = () => {
      scroller.style.setProperty('--akds-dataview-scroll-padding-top', `${thead.getBoundingClientRect().height}px`);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(thead);
    return () => {
      observer?.disconnect();
      scroller.style.removeProperty('--akds-dataview-scroll-padding-top');
    };
  }, [tableRef, stickyHeader]);
}

/**
 * The element that scrolls the table horizontally: Table's own wrapper
 * normally, or a DataViewScrollArea when virtualized.
 */
function findHorizontalScroller(table: HTMLElement): HTMLElement | null {
  let node = table.parentElement;
  while (node) {
    const { overflowX } = getComputedStyle(node);
    if (overflowX === 'auto' || overflowX === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

function shallowEqual(a: Record<string, number>, b: Record<string, number>) {
  const keys = Object.keys(b);
  return keys.length === Object.keys(a).length && keys.every((key) => a[key] === b[key]);
}
