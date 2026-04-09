import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface RedoIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const RedoIcon = React.forwardRef<SVGSVGElement, RedoIconProps>(
  function RedoIcon({ size = 'md', color = 'default', style, ...props }, ref) {
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
        <path d="M686-584H391q-70 0-120.5 46.5T220-422q0 69 50.5 115.5T391-260h280q13 0 21.5 8.5T701-230q0 13-8.5 21.5T671-200H392q-95 0-163.5-64T160-422q0-94 68.5-158T392-644h294l-93-93q-9-9-9-21t9-21q9-9 21-9t21 9l144 144q5 5 7 10t2 11q0 6-2 11t-7 10L635-449q-9 9-21 9t-21-9q-9-9-9-21t9-21l93-93Z" />
      </svg>
    );
  },
);

RedoIcon.displayName = 'RedoIcon';
