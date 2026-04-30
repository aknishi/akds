import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tag } from '../../../components/Tag/Tag';

expect.extend(toHaveNoViolations);

describe('Tag', () => {
  it('renders children as text', () => {
    render(<Tag>Design</Tag>);
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('applies base and default modifier classes', () => {
    const { container } = render(<Tag>Label</Tag>);
    const tag = container.firstChild as HTMLElement;
    expect(tag).toHaveClass('akds-tag', 'akds-tag--default', 'akds-tag--md');
  });

  it('applies variant modifier classes', () => {
    const variants = ['default', 'info', 'success', 'warning', 'error'] as const;
    const { rerender, container } = render(<Tag variant="default">Label</Tag>);
    variants.forEach(variant => {
      rerender(<Tag variant={variant}>Label</Tag>);
      expect(container.firstChild).toHaveClass(`akds-tag--${variant}`);
    });
  });

  it('applies size modifier classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const { rerender, container } = render(<Tag size="sm">Label</Tag>);
    sizes.forEach(size => {
      rerender(<Tag size={size}>Label</Tag>);
      expect(container.firstChild).toHaveClass(`akds-tag--${size}`);
    });
  });

  it('renders no dismiss button when onDismiss is not provided', () => {
    render(<Tag>Label</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a dismiss button when onDismiss is provided', () => {
    render(<Tag onDismiss={() => {}}>Label</Tag>);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('uses custom dismissLabel for the dismiss button', () => {
    render(<Tag onDismiss={() => {}} dismissLabel="Remove React">React</Tag>);
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();
    render(<Tag onDismiss={handleDismiss}>Label</Tag>);
    await user.click(screen.getByRole('button'));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('applies dismissible class when onDismiss is provided', () => {
    const { container } = render(<Tag onDismiss={() => {}}>Label</Tag>);
    expect(container.firstChild).toHaveClass('akds-tag--dismissible');
  });

  it('forwards data-testid via rest spread', () => {
    render(<Tag data-testid="my-tag">Label</Tag>);
    expect(screen.getByTestId('my-tag')).toBeInTheDocument();
  });

  it('forwards ref to the span element', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Tag ref={ref}>Label</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Tag>Label</Tag>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with dismiss button', async () => {
      const { container } = render(<Tag onDismiss={() => {}} dismissLabel="Remove Label">Label</Tag>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
