import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface AppsIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const AppsIcon = React.forwardRef<SVGSVGElement, AppsIconProps>(
  function AppsIcon({ size = 'md', color = 'default', className, ...props }, ref) {
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
        <path d="M179-179q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19ZM179-433q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19ZM179-687q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Z" />
      </svg>
    );
  },
);

AppsIcon.displayName = 'AppsIcon';
