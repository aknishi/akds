import React from 'react';
import clsx from 'clsx';
import './Th.css';
import type { ThProps } from './Th.types';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { ArrowDownIcon, ArrowUpIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-th');

const MIN_COLUMN_WIDTH = 48;
const KEYBOARD_RESIZE_STEP = 10;

export const Th = React.forwardRef<HTMLTableCellElement, ThProps>(
  function Th(
    {
      align,
      resizable = false,
      width,
      defaultWidth,
      onWidthChange,
      sortable = false,
      sortDirection,
      onSort,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const cellRef = React.useRef<HTMLTableCellElement | null>(null);
    const setRefs = React.useCallback((node: HTMLTableCellElement | null) => {
      cellRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTableCellElement | null>).current = node;
    }, [ref]);

    const isControlled = width !== undefined;
    const [internalWidth, setInternalWidth] = React.useState(defaultWidth);
    const resolvedWidth = isControlled ? width : internalWidth;
    const dragRef = React.useRef<{ startX: number; startWidth: number } | null>(null);
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const commitWidth = (next: number) => {
      const clamped = Math.max(MIN_COLUMN_WIDTH, next);
      if (!isControlled) setInternalWidth(clamped);
      onWidthChange?.(clamped);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
      const startWidth = resolvedWidth ?? cellRef.current?.getBoundingClientRect().width ?? MIN_COLUMN_WIDTH;
      dragRef.current = { startX: e.clientX, startWidth };
      e.currentTarget.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (!dragRef.current) return;
      commitWidth(dragRef.current.startWidth + (e.clientX - dragRef.current.startX));
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
      dragRef.current = null;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      const current = resolvedWidth ?? cellRef.current?.getBoundingClientRect().width ?? MIN_COLUMN_WIDTH;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        commitWidth(current - KEYBOARD_RESIZE_STEP);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        commitWidth(current + KEYBOARD_RESIZE_STEP);
      }
    };

    const SortIcon = sortDirection === 'descending' ? ArrowDownIcon : ArrowUpIcon;

    return (
      <th
        ref={setRefs}
        className={clsx(
          withBaseName(),
          { [withBaseName('center')]: align === 'center' },
          { [withBaseName('right')]: align === 'right' },
          { [withBaseName('resizable')]: resizable },
          { [withBaseName('sortable')]: sortable },
          className,
        )}
        style={resolvedWidth !== undefined ? { width: resolvedWidth, ...style } : style}
        aria-sort={sortable && sortDirection ? sortDirection : undefined}
        {...rest}
      >
        {sortable ? (
          // A real button (not onClick on the <th>) gives focus, Enter/Space
          // and an interactive role for free. The resize handle stays outside
          // it, so resizing never triggers a sort.
          <button
            type="button"
            className={withBaseName.el('sort-button')}
            onClick={onSort}
            onPointerDown={(e) => rippleRef.current?.trigger(e)}
          >
            <span className={withBaseName.el('sort-label')}>{children}</span>
            <SortIcon
              aria-hidden="true"
              size="sm"
              color="currentColor"
              className={clsx(
                withBaseName.el('sort-icon'),
                { [withBaseName.el('sort-icon') + '--active']: sortDirection !== undefined },
              )}
            />
            <RippleBase ref={rippleRef} />
          </button>
        ) : children}
        {resizable && (
          <span
            className={withBaseName.el('resize-handle')}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize column"
            aria-valuenow={resolvedWidth !== undefined ? Math.round(resolvedWidth) : undefined}
            aria-valuemin={MIN_COLUMN_WIDTH}
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onKeyDown={handleKeyDown}
          />
        )}
      </th>
    );
  },
);

Th.displayName = 'Th';
