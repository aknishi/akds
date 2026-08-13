import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface SpeedFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const SpeedFilledIcon = React.forwardRef<SVGSVGElement, SpeedFilledIconProps>(
  function SpeedFilledIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M418-340q25 25 63 23.5t55-27.5l180-271q7-11-1.5-19.5T695-636L424-456q-26 18-28.5 54.5T418-340ZM192-160q-18 0-34-8.5T134-193q-26-48-40-100T80-399q0-83 31.5-156T197-682.5q54-54.5 126.5-86T478-800q83 0 156.5 31.5t128 86Q817-628 848.5-555T880-399q0 54-13 106.5T827-193q-9 16-25 24.5t-34 8.5H192Z" />
      </svg>
    );
  },
);

SpeedFilledIcon.displayName = 'SpeedFilledIcon';
