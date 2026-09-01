import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AIButton } from '../../../components/AIButton/AIButton';

expect.extend(toHaveNoViolations);

describe('AIButton', () => {
  it('renders children', () => {
    render(<AIButton>Generate</AIButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Generate');
  });

  it('applies default classes', () => {
    render(<AIButton>Generate</AIButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('akds-ai-button');
  });

  it('shows loadingLabel and disables button when loading', () => {
    render(<AIButton loading>Generate</AIButton>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('akds-ai-button--loading');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveTextContent('Generating');
  });

  it('does not apply the disabled class while only loading (so the generating animation keeps playing)', () => {
    render(<AIButton loading>Generate</AIButton>);
    expect(screen.getByRole('button')).not.toHaveClass('akds-ai-button--disabled');
  });

  it('applies the disabled class for the explicit disabled prop', () => {
    render(<AIButton disabled>Generate</AIButton>);
    expect(screen.getByRole('button')).toHaveClass('akds-ai-button--disabled');
  });

  it('uncontrolled: enters loading state on click', async () => {
    const onClick = vi.fn();
    render(<AIButton onClick={onClick}>Generate</AIButton>);
    const btn = screen.getByRole('button');

    await userEvent.click(btn);
    expect(btn).toHaveClass('akds-ai-button--loading');
  });

  it('controlled: the loading prop takes precedence even when onClick returns a promise', async () => {
    const onClick = vi.fn(() => Promise.resolve());
    render(
      <AIButton loading={false} onClick={onClick}>
        Generate
      </AIButton>,
    );
    const btn = screen.getByRole('button');

    await userEvent.click(btn);
    expect(btn).not.toHaveClass('akds-ai-button--loading');
  });

  it('supports a custom loadingLabel', () => {
    render(
      <AIButton loading loadingLabel="Thinking…">
        Generate
      </AIButton>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Thinking…');
  });

  it('does not disable when not loading', () => {
    render(<AIButton>Generate</AIButton>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('respects the disabled prop', () => {
    render(<AIButton disabled>Generate</AIButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<AIButton onClick={onClick}>Generate</AIButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <AIButton disabled onClick={onClick}>
        Generate
      </AIButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const onClick = vi.fn();
    render(
      <AIButton loading onClick={onClick}>
        Generate
      </AIButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('focusableWhenDisabled: button is not natively disabled but has aria-disabled', () => {
    render(
      <AIButton disabled focusableWhenDisabled>
        Generate
      </AIButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('focusableWhenDisabled: onClick is not called when clicked', async () => {
    const onClick = vi.fn();
    render(
      <AIButton disabled focusableWhenDisabled onClick={onClick}>
        Generate
      </AIButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards additional HTML attributes', () => {
    render(
      <AIButton data-testid="ai-btn" aria-label="Generate content">
        Generate
      </AIButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-testid', 'ai-btn');
    expect(btn).toHaveAttribute('aria-label', 'Generate content');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<AIButton ref={ref}>Generate</AIButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<AIButton>Generate</AIButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<AIButton disabled>Generate</AIButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when loading', async () => {
      const { container } = render(<AIButton loading>Generate</AIButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when focusableWhenDisabled', async () => {
      const { container } = render(
        <AIButton disabled focusableWhenDisabled>
          Generate
        </AIButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
