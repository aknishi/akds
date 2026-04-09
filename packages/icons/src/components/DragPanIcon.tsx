import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface DragPanIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const DragPanIcon = React.forwardRef<SVGSVGElement, DragPanIconProps>(
  function DragPanIcon({ size = 'md', color = 'default', style, ...props }, ref) {
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
        <path d="M450-450H198l62 62q9 9 9 22t-9 22q-9 9-22 9t-22-9L101-459q-5-5-7-10t-2-11q0-6 2-11t7-10l116-116q9-9 22-9t22 9q9 9 9 22t-9 22l-63 63h252v-252l-62 62q-9 9-22 9t-22-9q-9-9-9-22t9-22l115-115q5-5 10-7t11-2q6 0 11 2t10 7l115 115q9 9 9 22t-9 22q-9 9-22 9t-22-9l-62-62v252h252l-62-62q-9-9-9-22t9-22q9-9 22-9t22 9l115 115q5 5 7 10t2 11q0 6-2 11t-7 10L744-344q-9 9-22 9t-22-9q-9-9-9-22t9-22l62-62H510v252l67-67q9-9 22-9t22 9q9 9 9 22t-9 22L501-101q-5 5-10 7t-11 2q-6 0-11-2t-10-7L339-221q-9-9-9-22t9-22q9-9 22-9t22 9l67 67v-252Z" />
      </svg>
    );
  },
);

DragPanIcon.displayName = 'DragPanIcon';
