import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface CallFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const CallFilledIcon = React.forwardRef<SVGSVGElement, CallFilledIconProps>(
  function CallFilledIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
    const px = SIZE_MAP[size];
    const isSemantic = (SEMANTIC_ICON_COLORS as readonly string[]).includes(color as string);
    const classes = [
      'akds-icon',
      isSemantic ? (color !== 'default' ? `akds-icon--${color}` : null) : 'akds-icon--custom',
      className,
    ].filter(Boolean).join(' ');
    const mergedStyle = isSemantic
      ? style
      : ({ '--akds-icon-custom-color': color, ...style } as React.CSSProperties);
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
        style={mergedStyle}
        {...props}
      >
        <path d="M795-120q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19 13-32t32-13h140q14 0 24 10t14 25l27 126q2 14-.5 25.5T359-634L259-533q26 44 55 82t64 72q37 38 78 69.5t86 55.5l95-98q10-11 23-15t26-2l119 26q15 4 25 16t10 27v135q0 19-13 32t-32 13Z" />
      </svg>
    );
  },
);

CallFilledIcon.displayName = 'CallFilledIcon';
