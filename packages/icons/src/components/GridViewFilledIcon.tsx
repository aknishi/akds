import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface GridViewFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const GridViewFilledIcon = React.forwardRef<SVGSVGElement, GridViewFilledIconProps>(
  function GridViewFilledIcon({ size = 'md', color = 'default', className, ...props }, ref) {
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
        <path d="M180-510q-24.75 0-42.37-17.63Q120-545.25 120-570v-210q0-24.75 17.63-42.38Q155.25-840 180-840h210q24.75 0 42.38 17.62Q450-804.75 450-780v210q0 24.75-17.62 42.37Q414.75-510 390-510H180Zm0 390q-24.75 0-42.37-17.63Q120-155.25 120-180v-210q0-24.75 17.63-42.38Q155.25-450 180-450h210q24.75 0 42.38 17.62Q450-414.75 450-390v210q0 24.75-17.62 42.37Q414.75-120 390-120H180Zm390-390q-24.75 0-42.37-17.63Q510-545.25 510-570v-210q0-24.75 17.63-42.38Q545.25-840 570-840h210q24.75 0 42.38 17.62Q840-804.75 840-780v210q0 24.75-17.62 42.37Q804.75-510 780-510H570Zm0 390q-24.75 0-42.37-17.63Q510-155.25 510-180v-210q0-24.75 17.63-42.38Q545.25-450 570-450h210q24.75 0 42.38 17.62Q840-414.75 840-390v210q0 24.75-17.62 42.37Q804.75-120 780-120H570Z" />
      </svg>
    );
  },
);

GridViewFilledIcon.displayName = 'GridViewFilledIcon';
