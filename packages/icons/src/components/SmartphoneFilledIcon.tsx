import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface SmartphoneFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const SmartphoneFilledIcon = React.forwardRef<SVGSVGElement, SmartphoneFilledIconProps>(
  function SmartphoneFilledIcon({ size = 'md', color = 'default', className, ...props }, ref) {
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
        <path d="M260-40q-25 0-42.5-17.5T200-100v-760q0-24 18-42t42-18h438q25 0 42.5 17.5T758-860v150q18 3 30 17t12 32v74q0 19-12 33t-30 17v437q0 25-17.5 42.5T698-40H260Zm240-689q9-9 9-21t-9-21q-9-9-21-9t-21 9q-9 9-9 21t9 21q9 9 21 9t21-9Z" />
      </svg>
    );
  },
);

SmartphoneFilledIcon.displayName = 'SmartphoneFilledIcon';
