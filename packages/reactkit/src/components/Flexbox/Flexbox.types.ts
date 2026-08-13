import React from 'react';

export type FlexboxSpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Accepts a spacing token name ('xs'–'2xl') which maps to `--akds-spacing-layout-*`,
 * a number which maps to the corresponding hundredth token (e.g. `1` → `--akds-spacing-100`,
 * `1.5` → `--akds-spacing-150`), or any valid CSS length value (e.g. '8px', '1rem').
 */
export type FlexboxSpacing = FlexboxSpacingSize | number | (string & {});

/** @deprecated Use FlexboxSpacingSize instead. */
export type FlexboxGapSize = FlexboxSpacingSize;

/** @deprecated Use FlexboxSpacing instead. */
export type FlexboxGap = FlexboxSpacing;

export interface FlexboxProps extends React.HTMLAttributes<HTMLElement> {
  /** Maps to `justify-content`. */
  justify?: React.CSSProperties['justifyContent'];
  /** Maps to `align-items`. */
  align?: React.CSSProperties['alignItems'];
  /** When true, sets `flex-wrap: wrap`. When false or omitted, `flex-wrap: nowrap`. */
  wrap?: boolean;
  /** Maps to `flex-direction`. */
  direction?: React.CSSProperties['flexDirection'];
  /** Maps to `gap`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  gap?: FlexboxSpacing;
  /** Maps to `padding` (shorthand). Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  padding?: FlexboxSpacing;
  /** Maps to `padding-top`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  pt?: FlexboxSpacing;
  /** Maps to `padding-right`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  pr?: FlexboxSpacing;
  /** Maps to `padding-bottom`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  pb?: FlexboxSpacing;
  /** Maps to `padding-left`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  pl?: FlexboxSpacing;
  /** Sets `padding-left` and `padding-right` together. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  px?: FlexboxSpacing;
  /** Sets `padding-top` and `padding-bottom` together. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  py?: FlexboxSpacing;
  /** Maps to `margin` (shorthand). Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  margin?: FlexboxSpacing;
  /** Maps to `margin-top`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  mt?: FlexboxSpacing;
  /** Maps to `margin-right`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  mr?: FlexboxSpacing;
  /** Maps to `margin-bottom`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  mb?: FlexboxSpacing;
  /** Maps to `margin-left`. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  ml?: FlexboxSpacing;
  /** Sets `margin-left` and `margin-right` together. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  mx?: FlexboxSpacing;
  /** Sets `margin-top` and `margin-bottom` together. Accepts a spacing token, a number (maps to the hundredth token, e.g. 1.5 → --akds-spacing-150), or CSS value. */
  my?: FlexboxSpacing;
  /** The HTML element to render as. Defaults to 'div'. */
  as?: React.ElementType;
  /** Content rendered inside the flexbox container. */
  children?: React.ReactNode;
}
