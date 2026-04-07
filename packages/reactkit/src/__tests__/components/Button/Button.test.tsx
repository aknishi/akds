import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../../../components/Button/Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('akds-button');
    expect(btn).toHaveClass('akds-button--solid');
    expect(btn).toHaveClass('akds-button--neutral');
    expect(btn).toHaveClass('akds-button--md');
  });

  it('applies appearance variant classes', () => {
    const { rerender } = render(<Button appearance="transparent">T</Button>);
    expect(screen.getByRole('button')).toHaveClass('akds-button--transparent');

    rerender(<Button appearance="bordered">T</Button>);
    expect(screen.getByRole('button')).toHaveClass('akds-button--bordered');
  });

  it('applies sentiment variant classes', () => {
    const sentiments = ['neutral', 'success', 'destructive'] as const;
    for (const sentiment of sentiments) {
      const { unmount } = render(<Button sentiment={sentiment}>T</Button>);
      expect(screen.getByRole('button')).toHaveClass(`akds-button--${sentiment}`);
      unmount();
    }
  });

  it('applies size variant classes', () => {
    const { rerender } = render(<Button size="sm">T</Button>);
    expect(screen.getByRole('button')).toHaveClass('akds-button--sm');

    rerender(<Button size="lg">T</Button>);
    expect(screen.getByRole('button')).toHaveClass('akds-button--lg');
  });

  it('shows spinner and disables button when loading', () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('akds-button--disabled');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn.querySelector('.akds-spinner')).toBeInTheDocument();
  });

  it('does not disable when not loading', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('respects the disabled prop', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('focusableWhenDisabled: button is not natively disabled but has aria-disabled', () => {
    render(<Button disabled focusableWhenDisabled>Click me</Button>);
    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('focusableWhenDisabled: onClick is not called when clicked', async () => {
    const onClick = vi.fn();
    render(<Button disabled focusableWhenDisabled onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards additional HTML attributes', () => {
    render(<Button type="submit" aria-label="Submit form">Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'Submit form');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Button>Click me</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Button disabled>Click me</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when loading', async () => {
      const { container } = render(<Button loading>Click me</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when focusableWhenDisabled', async () => {
      const { container } = render(
        <Button disabled focusableWhenDisabled>Click me</Button>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
