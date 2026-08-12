import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface ThumbsUpIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const ThumbsUpIcon = React.forwardRef<SVGSVGElement, ThumbsUpIconProps>(
  function ThumbsUpIcon({ size = 'md', color = 'default', className, ...props }, ref) {
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
        <path d="M855-632q24 0 42 18t18 42v81.84q0 7.16 1.5 14.66T915-461L789-171q-8.88 21.25-29.59 36.12Q738.69-120 716-120H272v-512l225-238q13.6-14 32.19-16.5Q547.77-889 565-879q17 10 25.5 27.5t4.2 36.5L556-632h299Zm-523 25v427h397l126-299v-93H482l53-249-203 214ZM139-120q-24.75 0-42.37-17.63Q79-155.25 79-180v-392q0-24.75 17.63-42.38Q114.25-632 139-632h133v60H139v392h133v60H139Zm193-60v-427 427Z" />
      </svg>
    );
  },
);

ThumbsUpIcon.displayName = 'ThumbsUpIcon';
