import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP } from '../types.js';
import '../Icon.css';

export interface ScheduleIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token via the akds-icon--{color} class. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor;
}

export const ScheduleIcon = React.forwardRef<SVGSVGElement, ScheduleIconProps>(
  function ScheduleIcon({ size = 'md', color = 'default', className, ...props }, ref) {
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
        <path d="M513-492v-171q0-13-8.5-21.5T483-693q-13 0-21.5 8.5T453-663v183q0 6 2 11t6 10l144 149q9 10 22.5 9.5T650-310q9-9 9-22t-9-22L513-492ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-82 31.5-155t86-127.5Q252-817 325-848.5T480-880q82 0 155 31.5t127.5 86Q817-708 848.5-635T880-480q0 82-31.5 155t-86 127.5Q708-143 635-111.5T480-80Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480-820q-140 0-240 100T140-480q0 140 100 240t240 100Z" />
      </svg>
    );
  },
);

ScheduleIcon.displayName = 'ScheduleIcon';
