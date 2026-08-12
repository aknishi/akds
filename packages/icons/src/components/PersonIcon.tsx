import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface PersonIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const PersonIcon = React.forwardRef<SVGSVGElement, PersonIconProps>(
  function PersonIcon({ size = 'md', color = 'default', className, ...props }, ref) {
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
        <path d="M372-523q-42-42-42-108t42-108q42-42 108-42t108 42q42 42 42 108t-42 108q-42 42-108 42t-108-42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v34q0 25-17.5 42.5T740-160H220q-25 0-42.5-17.5T160-220Zm60 0h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm324.5-346.5Q570-592 570-631t-25.5-64.5Q519-721 480-721t-64.5 25.5Q390-670 390-631t25.5 64.5Q441-541 480-541t64.5-25.5ZM480-631Zm0 411Z" />
      </svg>
    );
  },
);

PersonIcon.displayName = 'PersonIcon';
