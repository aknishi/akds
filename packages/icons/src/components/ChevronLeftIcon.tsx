import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface ChevronLeftIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const ChevronLeftIcon = React.forwardRef<SVGSVGElement, ChevronLeftIconProps>(
  function ChevronLeftIcon({ size = 'md', color = 'default', className, ...props }, ref) {
    const px = SIZE_MAP[size];
    const classes = ['akds-icon', color !== 'default' ? `akds-icon--${color}` : null, className]
      .filter(Boolean)
      .join(' ');
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width={px}
        height={px}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={classes}
        {...props}
      >
        <path d="m406-481 177 177q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L341-460q-5-5-7-10t-2-11q0-6 2-11t7-10l199-199q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L406-481Z" />
      </svg>
    );
  },
);

ChevronLeftIcon.displayName = 'ChevronLeftIcon';
