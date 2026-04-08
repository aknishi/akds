import React from 'react';
import clsx from 'clsx';
import './Text.css';
import type { TextProps, TextStyleAs } from './Text.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-text');

const defaultElement: Record<TextStyleAs, React.ElementType> = {
  hero: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  label: 'span',
  caption: 'span',
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  function Text(
    {
      styleAs = 'body',
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const Component = (as ?? defaultElement[styleAs]) as React.ElementType;

    return (
      <Component
        ref={ref}
        className={clsx(withBaseName(), withBaseName(styleAs), className)}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = 'Text';
