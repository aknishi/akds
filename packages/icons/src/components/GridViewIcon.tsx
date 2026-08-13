import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface GridViewIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const GridViewIcon = React.forwardRef<SVGSVGElement, GridViewIconProps>(
  function GridViewIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M180-510q-24.75 0-42.37-17.63Q120-545.25 120-570v-210q0-24.75 17.63-42.38Q155.25-840 180-840h210q24.75 0 42.38 17.62Q450-804.75 450-780v210q0 24.75-17.62 42.37Q414.75-510 390-510H180Zm0 390q-24.75 0-42.37-17.63Q120-155.25 120-180v-210q0-24.75 17.63-42.38Q155.25-450 180-450h210q24.75 0 42.38 17.62Q450-414.75 450-390v210q0 24.75-17.62 42.37Q414.75-120 390-120H180Zm390-390q-24.75 0-42.37-17.63Q510-545.25 510-570v-210q0-24.75 17.63-42.38Q545.25-840 570-840h210q24.75 0 42.38 17.62Q840-804.75 840-780v210q0 24.75-17.62 42.37Q804.75-510 780-510H570Zm0 390q-24.75 0-42.37-17.63Q510-155.25 510-180v-210q0-24.75 17.63-42.38Q545.25-450 570-450h210q24.75 0 42.38 17.62Q840-414.75 840-390v210q0 24.75-17.62 42.37Q804.75-120 780-120H570ZM180-570h210v-210H180v210Zm390 0h210v-210H570v210Zm0 390h210v-210H570v210Zm-390 0h210v-210H180v210Zm390-390Zm0 180Zm-180 0Zm0-180Z" />
      </svg>
    );
  },
);

GridViewIcon.displayName = 'GridViewIcon';
