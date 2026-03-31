import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../../../components/Spinner/Spinner';

describe('Spinner', () => {
  it('renders a hidden span', () => {
    const { container } = render(<Spinner />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default size class', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('span')).toHaveClass('akds-spinner--md');
  });

  it('applies size variant classes', () => {
    const sizes = ['sm', 'lg'] as const;
    for (const size of sizes) {
      const { container, unmount } = render(<Spinner size={size} />);
      expect(container.querySelector('span')).toHaveClass(`akds-spinner--${size}`);
      unmount();
    }
  });

  it('always has the base spinner class', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('span')).toHaveClass('akds-spinner');
  });

  it('merges custom className', () => {
    const { container } = render(<Spinner className="my-spinner" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('akds-spinner');
    expect(span).toHaveClass('my-spinner');
  });
});
