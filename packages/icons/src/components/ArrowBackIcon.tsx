import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface ArrowBackIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const ArrowBackIcon = React.forwardRef<SVGSVGElement, ArrowBackIconProps>(
  function ArrowBackIcon({ size = 'md', color = 'default', style, ...props }, ref) {
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
        <path d="m274-450 227 227q9 9 9 21t-9 21q-9 9-21 9t-21-9L181-459q-5-5-7-10t-2-11q0-6 2-11t7-10l278-278q9-9 21-9t21 9q9 9 9 21t-9 21L274-510h496q13 0 21.5 8.5T800-480q0 13-8.5 21.5T770-450H274Z" />
      </svg>
    );
  },
);

ArrowBackIcon.displayName = 'ArrowBackIcon';
