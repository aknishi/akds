import React from 'react';
import clsx from 'clsx';
import './Pagination.css';
import type { PaginationItem, PaginationProps } from './Pagination.types';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { ChevronLeftIcon, ChevronRightIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-pagination');

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Builds the list of slots to render. Always shows the first and last page,
 * the current page, and `siblingCount` pages either side of it. Once the
 * list needs truncating it always renders the same number of slots
 * (`siblingCount * 2 + 5`), so the control keeps a stable width as the
 * current page moves and the previous/next buttons don't shift under the
 * pointer.
 */
export const getPaginationItems = (page: number, count: number, siblingCount: number): PaginationItem[] => {
  const totalSlots = siblingCount * 2 + 5;
  if (count <= totalSlots) return range(1, count);

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, count);
  // An ellipsis only replaces two or more pages — hiding a single page
  // behind "…" would take the same space as just showing it.
  const showStartEllipsis = leftSibling > 3;
  const showEndEllipsis = rightSibling < count - 2;
  const edgeItemCount = 3 + siblingCount * 2;

  if (!showStartEllipsis) {
    return [...range(1, edgeItemCount), 'end-ellipsis', count];
  }
  if (!showEndEllipsis) {
    return [1, 'start-ellipsis', ...range(count - edgeItemCount + 1, count)];
  }
  return [1, 'start-ellipsis', ...range(leftSibling, rightSibling), 'end-ellipsis', count];
};

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  current?: boolean;
  /** Blocks activation but keeps the button focusable (previous/next at the ends). */
  inactive?: boolean;
}

/** One button in the list — each needs its own ripple handle. */
function PaginationButton({
  current = false,
  inactive = false,
  disabled = false,
  className,
  children,
  onClick,
  onPointerDown,
  ...rest
}: PaginationButtonProps) {
  const rippleRef = React.useRef<RippleBaseHandle>(null);
  const isDisabled = disabled || inactive;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    rippleRef.current?.trigger(e);
    onPointerDown?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (inactive) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type="button"
      disabled={disabled || undefined}
      aria-disabled={isDisabled || undefined}
      aria-current={current ? 'page' : undefined}
      className={clsx(
        withBaseName.el('button'),
        {
          [withBaseName.el('button') + '--current']: current,
          [withBaseName.el('button') + '--disabled']: isDisabled,
        },
        className,
      )}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      {children}
      <RippleBase ref={rippleRef} disabled={isDisabled} onDark={current} />
    </button>
  );
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      count,
      page,
      defaultPage = 1,
      onPageChange,
      siblingCount = 1,
      disabled = false,
      getPageLabel = (p: number) => `Page ${p}`,
      previousLabel = 'Previous page',
      nextLabel = 'Next page',
      'aria-label': ariaLabel = 'Pagination',
      className,
      ...rest
    },
    ref,
  ) {
    const pageCount = Math.max(1, Math.floor(count));
    const isControlled = page !== undefined;
    const [internalPage, setInternalPage] = React.useState(defaultPage);
    const currentPage = Math.min(Math.max(isControlled ? page : internalPage, 1), pageCount);

    const goTo = (next: number) => {
      if (next === currentPage || next < 1 || next > pageCount) return;
      if (!isControlled) setInternalPage(next);
      onPageChange?.(next);
    };

    const items = getPaginationItems(currentPage, pageCount, Math.max(0, siblingCount));

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={clsx(withBaseName(), { [withBaseName('disabled')]: disabled }, className)}
        {...rest}
      >
        <ul className={withBaseName.el('list')}>
          <li className={withBaseName.el('item')}>
            {/* At the first/last page the arrow stays focusable (aria-disabled)
                rather than natively disabled, so a keyboard user who just
                pressed it doesn't have focus dropped to the document body. */}
            <PaginationButton
              aria-label={previousLabel}
              disabled={disabled}
              inactive={currentPage <= 1}
              className={withBaseName.el('button') + '--previous'}
              onClick={() => goTo(currentPage - 1)}
            >
              <ChevronLeftIcon className={withBaseName.el('icon')} />
            </PaginationButton>
          </li>
          {items.map(item =>
            typeof item === 'number' ? (
              // Keyed by page number so the clicked button keeps its DOM node
              // (and keyboard focus) when the list re-flows around it.
              <li key={item} className={withBaseName.el('item')}>
                <PaginationButton
                  aria-label={getPageLabel(item)}
                  current={item === currentPage}
                  disabled={disabled}
                  onClick={() => goTo(item)}
                >
                  {item}
                </PaginationButton>
              </li>
            ) : (
              // Purely visual — screen readers already hear each page's
              // number, so the gap is skipped.
              <li key={item} className={withBaseName.el('item')} aria-hidden="true">
                <span className={withBaseName.el('ellipsis')}>…</span>
              </li>
            ),
          )}
          <li className={withBaseName.el('item')}>
            <PaginationButton
              aria-label={nextLabel}
              disabled={disabled}
              inactive={currentPage >= pageCount}
              className={withBaseName.el('button') + '--next'}
              onClick={() => goTo(currentPage + 1)}
            >
              <ChevronRightIcon className={withBaseName.el('icon')} />
            </PaginationButton>
          </li>
        </ul>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
