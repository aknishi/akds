import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface PrintFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const PrintFilledIcon = React.forwardRef<SVGSVGElement, PrintFilledIconProps>(
  function PrintFilledIcon({ size = 'md', color = 'default', style, ...props }, ref) {
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
        <path d="M302-120q-24.75 0-42.37-17.63Q242-155.25 242-180v-116H140q-24.75 0-42.37-17.63Q80-331.25 80-356v-186q0-45.05 30.5-75.53Q141-648 186-648h588q45.05 0 75.53 30.47Q880-587.05 880-542v186q0 24.75-17.62 42.37Q844.75-296 820-296H718v116q0 24.75-17.62 42.37Q682.75-120 658-120H302Zm416-558H242v-102q0-24.75 17.63-42.38Q277.25-840 302-840h356q24.75 0 42.38 17.62Q718-804.75 718-780v102Zm21 185q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9ZM302-180h356v-192H302v192Z" />
      </svg>
    );
  },
);

PrintFilledIcon.displayName = 'PrintFilledIcon';
