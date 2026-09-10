import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { GenerationLoader } from '../../../components/GenerationLoader/GenerationLoader';

expect.extend(toHaveNoViolations);

describe('GenerationLoader', () => {
  it('renders with the correct role and a default accessible name', () => {
    render(<GenerationLoader />);
    expect(screen.getByRole('status', { name: 'Generating' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<GenerationLoader />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass('akds-generation-loader');
    expect(el).toHaveClass('akds-generation-loader--md');
  });

  it('renders three dots', () => {
    const { container } = render(<GenerationLoader />);
    expect(container.querySelectorAll('.akds-generation-loader__dot')).toHaveLength(3);
  });

  it('renders a visible label when provided', () => {
    render(<GenerationLoader label="Generating response" />);
    expect(screen.getByText('Generating response')).toBeInTheDocument();
  });

  it('uses the visible label as the accessible name instead of the default', () => {
    render(<GenerationLoader label="Generating response" />);
    expect(screen.getByRole('status', { name: 'Generating response' })).toBeInTheDocument();
  });

  it('applies size classes', () => {
    (['sm', 'md', 'lg'] as const).forEach(size => {
      const { unmount } = render(<GenerationLoader size={size} />);
      expect(screen.getByRole('status')).toHaveClass(`akds-generation-loader--${size}`);
      unmount();
    });
  });

  it('forwards additional HTML attributes', () => {
    render(<GenerationLoader data-testid="loader" aria-label="Custom label" />);
    const el = screen.getByTestId('loader');
    expect(el).toHaveAttribute('aria-label', 'Custom label');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<GenerationLoader ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('axe accessibility', () => {
    it('has no violations with the default dots-only indicator', async () => {
      const { container } = render(<GenerationLoader />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with a visible label', async () => {
      const { container } = render(<GenerationLoader label="Generating response" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
