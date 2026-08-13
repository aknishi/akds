import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface FileCopyFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const FileCopyFilledIcon = React.forwardRef<SVGSVGElement, FileCopyFilledIconProps>(
  function FileCopyFilledIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M780-160H260q-24 0-42-18t-18-42v-640q0-24 18-42t42-18h323q12 0 23.5 5t19.5 13l196 196q8 8 13 19.5t5 23.5v443q0 24-18 42t-42 18Zm0-502L578-860v153q0 19 13 32t32 13h157ZM140-40q-24 0-42-18t-18-42v-589q0-13 8.5-21.5T110-719q13 0 21.5 8.5T140-689v589h468q13 0 21.5 8.5T638-70q0 13-8.5 21.5T608-40H140Z" />
      </svg>
    );
  },
);

FileCopyFilledIcon.displayName = 'FileCopyFilledIcon';
