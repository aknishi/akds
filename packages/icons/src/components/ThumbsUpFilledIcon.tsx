import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface ThumbsUpFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const ThumbsUpFilledIcon = React.forwardRef<SVGSVGElement, ThumbsUpFilledIconProps>(
  function ThumbsUpFilledIcon({ size = 'md', color = 'default', style, ...props }, ref) {
    const px = SIZE_MAP[size];
    const fill = COLOR_MAP[color];
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
        style={fill ? { color: fill, ...style } : style}
        {...props}
      >
        <path d="M860-632q23 0 41.5 18.5T920-572v82q0 11-2.5 25.5T910-439L794-171q-9 21-29.5 36T721-120H314q-25 0-42.5-17.5T254-180v-428q0-11 4.5-22t12.5-19l207-218q14-14 33.5-17t36.5 7q17 10 25.5 28t4.5 37l-38 180h320ZM137-120q-23 0-40-17t-17-40v-398q0-23 17-40t40-17q23 0 40 17t17 40v398q0 23-17 40t-40 17Z" />
      </svg>
    );
  },
);

ThumbsUpFilledIcon.displayName = 'ThumbsUpFilledIcon';
