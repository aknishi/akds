import React from 'react';

/** Pin keys for TableView's own columns; prefixed so they can't clash with a team's column ids. */
export const SELECT_PIN_KEY = '__select';
export const ACTIONS_PIN_KEY = '__actions';

export type PinSide = 'left' | 'right';

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
 * Tracks whether the table is scrolled away from its start and end, so the
 * pinned columns only cast a shadow when content is actually hidden beneath
 * them.
 */
export function useHorizontalScrollEdges(tableRef: React.RefObject<HTMLTableElement>) {
  const [edges, setEdges] = React.useState({ start: false, end: false });

  React.useEffect(() => {
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
