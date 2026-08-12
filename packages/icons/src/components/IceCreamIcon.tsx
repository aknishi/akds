import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface IceCreamIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const IceCreamIcon = React.forwardRef<SVGSVGElement, IceCreamIconProps>(
  function IceCreamIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M120-555q0-45 27.5-88t80.5-58q16-99 88.5-159T480-920q91 0 163 60t89 159q53 15 80.5 58t27.5 88q0 75-56.5 117T664-408L506-94q-5 8-12 12.5T479-77q-8 0-15.5-4.5T452-94L298-408q-69 12-123.5-30T120-555Zm146 90q18 0 34-5t25-14l26-27 23 20q25 17 54.5 21.5T483-465q25 0 51-4.5t51-21.5l24-20 25 27q9 9 25.5 14t33.5 5q34 0 60.5-27.5T780-555q0-31-19-54t-54-29l-35-5-2-39q-11-79-61.5-128.5T480-860q-78 0-129 49.5T290-682l-3 39-35 8q-30 8-51 28.5T180-555q0 35 26.5 62.5T266-465Zm213 289 128-252-6-6q-28 15-60.5 22t-57.5 7q-32 0-65-7t-58-22l-6 5 125 253Zm1-486Z" />
      </svg>
    );
  },
);

IceCreamIcon.displayName = 'IceCreamIcon';
