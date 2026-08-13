import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ToggleButton } from '../../../components/ToggleButton/ToggleButton';

expect.extend(toHaveNoViolations);

describe('ToggleButton', () => {
  it('renders a button with the correct accessible name', () => {
    render(<ToggleButton>Bold</ToggleButton>);
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<ToggleButton>Bold</ToggleButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('akds-toggle-button');
    expect(button).toHaveClass('akds-toggle-button--md');
    expect(button).toHaveClass('akds-toggle-button--standalone');
    expect(button).toHaveClass('akds-toggle-button--neutral');
  });

  it('applies color modifier classes', () => {
    const colors = ['primary', 'success', 'error', 'neutral'] as const;
    for (const color of colors) {
      const { unmount } = render(<ToggleButton color={color}>Bold</ToggleButton>);
      expect(screen.getByRole('button')).toHaveClass(`akds-toggle-button--${color}`);
      unmount();
    }
  });

  it('applies size modifier classes', () => {
    const { rerender } = render(<ToggleButton size="sm">Bold</ToggleButton>);
    expect(screen.getByRole('button')).toHaveClass('akds-toggle-button--sm');

    rerender(<ToggleButton size="lg">Bold</ToggleButton>);
    expect(screen.getByRole('button')).toHaveClass('akds-toggle-button--lg');
  });

  it('is not pressed by default and toggles aria-pressed on click', async () => {
    render(<ToggleButton>Bold</ToggleButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('akds-toggle-button--active');

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects defaultPressed for uncontrolled usage', () => {
    render(<ToggleButton defaultPressed>Bold</ToggleButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('respects the controlled pressed prop and does not toggle internally', async () => {
    render(<ToggleButton pressed={false} onPressedChange={() => {}}>Bold</ToggleButton>);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onPressedChange with the next pressed state', async () => {
    const onPressedChange = vi.fn();
    render(<ToggleButton onPressedChange={onPressedChange}>Bold</ToggleButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('applies disabled modifier class and disables the button', () => {
    render(<ToggleButton disabled>Bold</ToggleButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('akds-toggle-button--disabled');
    expect(button).toBeDisabled();
  });

  it('does not call onPressedChange when disabled', async () => {
    const onPressedChange = vi.fn();
    render(
      <ToggleButton disabled onPressedChange={onPressedChange}>
        Bold
      </ToggleButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('forwards data attributes and other HTML attributes', () => {
    render(<ToggleButton data-testid="bold-toggle" aria-label="Bold">B</ToggleButton>);
    const button = screen.getByTestId('bold-toggle');
    expect(button).toHaveAttribute('aria-label', 'Bold');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<ToggleButton ref={ref}>Bold</ToggleButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<ToggleButton>Bold</ToggleButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when pressed', async () => {
      const { container } = render(<ToggleButton defaultPressed>Bold</ToggleButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<ToggleButton disabled>Bold</ToggleButton>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
