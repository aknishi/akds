import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface ApartmentIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const ApartmentIcon = React.forwardRef<SVGSVGElement, ApartmentIconProps>(
  function ApartmentIcon({ size = 'md', color = 'default', className, ...props }, ref) {
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
        <path d="M180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-435q0-24.75 17.63-42.38Q155.25-675 180-675h105v-105q0-24.75 17.63-42.38Q320.25-840 345-840h270q24.75 0 42.38 17.62Q675-804.75 675-780v270h105q24.75 0 42.38 17.62Q840-474.75 840-450v270q0 24.75-17.62 42.37Q804.75-120 780-120H533v-165H427v165H180Zm0-60h105v-105H180v105Zm0-165h105v-105H180v105Zm0-165h105v-105H180v105Zm165 165h105v-105H345v105Zm0-165h105v-105H345v105Zm0-165h105v-105H345v105Zm165 330h105v-105H510v105Zm0-165h105v-105H510v105Zm0-165h105v-105H510v105Zm165 495h105v-105H675v105Zm0-165h105v-105H675v105Z" />
      </svg>
    );
  },
);

ApartmentIcon.displayName = 'ApartmentIcon';
