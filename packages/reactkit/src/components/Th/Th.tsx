import React from 'react';
import clsx from 'clsx';
import './Th.css';
import type { ThProps } from './Th.types';
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

    return (
      <th
        ref={setRefs}
        className={clsx(
          withBaseName(),
          { [withBaseName('center')]: align === 'center' },
          { [withBaseName('right')]: align === 'right' },
          { [withBaseName('resizable')]: resizable },
          className,
        )}
        style={resolvedWidth !== undefined ? { width: resolvedWidth, ...style } : style}
        {...rest}
      >
        {children}
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
