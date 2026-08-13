import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface FileCopyIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const FileCopyIcon = React.forwardRef<SVGSVGElement, FileCopyIconProps>(
  function FileCopyIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M780-160H260q-24 0-42-18t-18-42v-640q0-24 18-42t42-18h323q12.44 0 23.72 5T626-902l196 196q8 8 13 19.28 5 11.28 5 23.72v443q0 24-18 42t-42 18Zm0-502H623q-18.75 0-31.87-13.13Q578-688.25 578-707v-153H260v640h520v-442ZM140-40q-24 0-42-18t-18-42v-589q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v589h468q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32Q620.75-40 608-40H140Zm120-820v198-198 640-640Z" />
      </svg>
    );
  },
);

FileCopyIcon.displayName = 'FileCopyIcon';
