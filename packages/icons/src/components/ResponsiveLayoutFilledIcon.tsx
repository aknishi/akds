import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface ResponsiveLayoutFilledIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (`default` | `error` | `warning` | `success` | `info`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const ResponsiveLayoutFilledIcon = React.forwardRef<SVGSVGElement, ResponsiveLayoutFilledIconProps>(
  function ResponsiveLayoutFilledIcon({ size = 'md', color = 'default', className, style, ...props }, ref) {
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
        <path d="M655-120q-12.75 0-21.37-8.63Q625-137.25 625-150v-415q0-24.75-17.62-42.38Q589.75-625 565-625H403q-12.75 0-21.37-8.63Q373-642.25 373-655v-155q0-12.75 8.63-21.38Q390.25-840 403-840h407q12.75 0 21.38 8.62Q840-822.75 840-810v660q0 12.75-8.62 21.37Q822.75-120 810-120H655Zm-252 0q-12.75 0-21.37-8.63Q373-137.25 373-150v-385q0-12.75 8.63-21.38Q390.25-565 403-565h132q12.75 0 21.38 8.62Q565-547.75 565-535v385q0 12.75-8.62 21.37Q547.75-120 535-120H403Zm-253 0q-12.75 0-21.37-8.63Q120-137.25 120-150v-385q0-12.75 8.63-21.38Q137.25-565 150-565h133q12.75 0 21.38 8.62Q313-547.75 313-535v385q0 12.75-8.62 21.37Q295.75-120 283-120H150Z" />
      </svg>
    );
  },
);

ResponsiveLayoutFilledIcon.displayName = 'ResponsiveLayoutFilledIcon';
