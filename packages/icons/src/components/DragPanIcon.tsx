import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface DragPanIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const DragPanIcon = React.forwardRef<SVGSVGElement, DragPanIconProps>(
  function DragPanIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M450-450H198l62 62q9 9 9 22t-9 22q-9 9-22 9t-22-9L101-459q-5-5-7-10t-2-11q0-6 2-11t7-10l116-116q9-9 22-9t22 9q9 9 9 22t-9 22l-63 63h252v-252l-62 62q-9 9-22 9t-22-9q-9-9-9-22t9-22l115-115q5-5 10-7t11-2q6 0 11 2t10 7l115 115q9 9 9 22t-9 22q-9 9-22 9t-22-9l-62-62v252h252l-62-62q-9-9-9-22t9-22q9-9 22-9t22 9l115 115q5 5 7 10t2 11q0 6-2 11t-7 10L744-344q-9 9-22 9t-22-9q-9-9-9-22t9-22l62-62H510v252l67-67q9-9 22-9t22 9q9 9 9 22t-9 22L501-101q-5 5-10 7t-11 2q-6 0-11-2t-10-7L339-221q-9-9-9-22t9-22q9-9 22-9t22 9l67 67v-252Z" />
      </svg>
    );
  },
);

DragPanIcon.displayName = 'DragPanIcon';
