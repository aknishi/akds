import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, COLOR_MAP } from '../types.js';

export interface PlantFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token. Defaults to "default" (inherits currentColor). */
  color?: IconColor;
}

export const PlantFilledIcon = React.forwardRef<SVGSVGElement, PlantFilledIconProps>(
  function PlantFilledIcon({ size = 'md', color = 'default', style, ...props }, ref) {
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
        <path d="M444-80q-42 0-78.5-8T298-112q32-119 87.5-230.5T535-529q-112 54-194.5 150T228-161q-4-4-7.5-7t-7.5-7q-45-45-69-103t-24-122q0-69 26-133t75-113q70-72 175-97t303-17q20 1 36.5 8.5T765-731q13 13 21 29.5t9 36.5q10 194-17 302t-99 180q-48 50-109 76.5T444-80Z" />
      </svg>
    );
  },
);

PlantFilledIcon.displayName = 'PlantFilledIcon';
