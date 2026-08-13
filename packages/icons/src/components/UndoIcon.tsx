import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface UndoIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const UndoIcon = React.forwardRef<SVGSVGElement, UndoIconProps>(
  function UndoIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M289-200q-13 0-21.5-8.5T259-230q0-13 8.5-21.5T289-260h280q70 0 120.5-46.5T740-422q0-69-50.5-115.5T569-584H274l93 93q9 9 9 21t-9 21q-9 9-21 9t-21-9L181-593q-5-5-7-10t-2-11q0-6 2-11t7-10l144-144q9-9 21-9t21 9q9 9 9 21t-9 21l-93 93h294q95 0 163.5 64T800-422q0 94-68.5 158T568-200H289Z" />
      </svg>
    );
  },
);

UndoIcon.displayName = 'UndoIcon';
