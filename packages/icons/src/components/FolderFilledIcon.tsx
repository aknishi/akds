import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface FolderFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const FolderFilledIcon = React.forwardRef<SVGSVGElement, FolderFilledIconProps>(
  function FolderFilledIcon({ size = 'md', color = 'default', style, ...props }, ref) {
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
        <path d="M140-160q-24 0-42-18.5T80-220v-520q0-23 18-41.5t42-18.5h256q12 0 23.5 5t19.5 13l42 42h339q23 0 41.5 18.5T880-680v460q0 23-18.5 41.5T820-160H140Z" />
      </svg>
    );
  },
);

FolderFilledIcon.displayName = 'FolderFilledIcon';
