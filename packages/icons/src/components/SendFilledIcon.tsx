import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface SendFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const SendFilledIcon = React.forwardRef<SVGSVGElement, SendFilledIconProps>(
  function SendFilledIcon({ size = 'md', color = 'default', style, ...props }, ref) {
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
        <path d="M162-178q-15 6-28.5-2.5T120-205v-200l302-75-302-77v-198q0-16 13.5-24.5T162-782l652 274q18 8 18 28t-18 28L162-178Z" />
      </svg>
    );
  },
);

SendFilledIcon.displayName = 'SendFilledIcon';
