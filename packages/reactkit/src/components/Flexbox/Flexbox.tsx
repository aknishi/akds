import React from 'react';
import clsx from 'clsx';
import './Flexbox.css';
import type { FlexboxProps, FlexboxSpacingSize } from './Flexbox.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-flexbox');

const spacingTokens: Record<FlexboxSpacingSize, string> = {
  xs: 'var(--akds-spacing-layout-xs)',
  sm: 'var(--akds-spacing-layout-sm)',
  md: 'var(--akds-spacing-layout-md)',
  lg: 'var(--akds-spacing-layout-lg)',
  xl: 'var(--akds-spacing-layout-xl)',
  '2xl': 'var(--akds-spacing-layout-2xl)',
};

function resolveSpacing(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return spacingTokens[value as FlexboxSpacingSize] ?? value;
}

export const Flexbox = React.forwardRef<HTMLElement, FlexboxProps>(
  function Flexbox(
    {
      justify,
      align,
      wrap,
      direction,
      gap,
      padding,
      pt,
      pr,
      pb,
      pl,
      px,
      py,
      margin,
      mt,
      mr,
      mb,
      ml,
      mx,
      my,
      as: Component = 'div',
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const cssVars = {
      '--akds-flexbox-justify': justify,
      '--akds-flexbox-align': align,
      '--akds-flexbox-wrap': wrap === true ? 'wrap' : wrap === false ? 'nowrap' : undefined,
      '--akds-flexbox-direction': direction,
      '--akds-flexbox-gap': resolveSpacing(gap),
      '--akds-flexbox-padding': resolveSpacing(padding),
      '--akds-flexbox-pt': resolveSpacing(pt),
      '--akds-flexbox-pr': resolveSpacing(pr),
      '--akds-flexbox-pb': resolveSpacing(pb),
      '--akds-flexbox-pl': resolveSpacing(pl),
      '--akds-flexbox-px': resolveSpacing(px),
      '--akds-flexbox-py': resolveSpacing(py),
      '--akds-flexbox-margin': resolveSpacing(margin),
      '--akds-flexbox-mt': resolveSpacing(mt),
      '--akds-flexbox-mr': resolveSpacing(mr),
      '--akds-flexbox-mb': resolveSpacing(mb),
      '--akds-flexbox-ml': resolveSpacing(ml),
      '--akds-flexbox-mx': resolveSpacing(mx),
      '--akds-flexbox-my': resolveSpacing(my),
    } as React.CSSProperties;

    // Strip undefined entries so they don't override CSS fallbacks
    const filteredVars = Object.fromEntries(
      Object.entries(cssVars).filter(([, v]) => v !== undefined),
    ) as React.CSSProperties;

    return (
      <Component
        ref={ref}
        className={clsx(withBaseName(), className)}
        style={{ ...filteredVars, ...style }}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

Flexbox.displayName = 'Flexbox';
