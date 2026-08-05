import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { IconButton } from '../../../components/IconButton/IconButton';

expect.extend(toHaveNoViolations);

const Icon = () => (
  <svg aria-hidden="true" focusable="false">
    <path d="M0 0h24v24H0z" />
  </svg>
);

describe('IconButton', () => {
  it('renders with the accessible name from aria-label', () => {
    render(
      <IconButton aria-label="Close">
        <Icon />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(
      <IconButton aria-label="Close">
        <Icon />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('akds-icon-button');
    expect(btn).toHaveClass('akds-icon-button--solid');
    expect(btn).toHaveClass('akds-icon-button--neutral');
  });

  it('applies appearance classes', () => {
    const appearances = ['solid', 'transparent', 'bordered'] as const;
    appearances.forEach(appearance => {
      const { unmount } = render(
        <IconButton appearance={appearance} aria-label="Close">
          <Icon />
        </IconButton>,
      );
      expect(screen.getByRole('button')).toHaveClass(`akds-icon-button--${appearance}`);
      unmount();
    });
  });

  it('applies emphasis classes', () => {
    const emphases = ['accented', 'neutral', 'success', 'destructive'] as const;
    emphases.forEach(emphasis => {
      const { unmount } = render(
        <IconButton emphasis={emphasis} aria-label="Close">
          <Icon />
        </IconButton>,
      );
      expect(screen.getByRole('button')).toHaveClass(`akds-icon-button--${emphasis}`);
      unmount();
    });
  });

  it('applies disabled class and attribute', () => {
    render(
      <IconButton disabled aria-label="Close">
        <Icon />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('akds-icon-button--disabled');
  });

  it('replaces the icon with a spinner and sets aria-busy when loading', () => {
    render(
      <IconButton loading aria-label="Saving">
        <Icon />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
    expect(btn.querySelector('.akds-spinner')).toBeInTheDocument();
  });

  it('calls onClick when active', async () => {
    const onClick = vi.fn();
    render(
      <IconButton onClick={onClick} aria-label="Close">
        <Icon />
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <IconButton onClick={onClick} disabled aria-label="Close">
        <Icon />
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('remains focusable and blocks clicks when focusableWhenDisabled', async () => {
    const onClick = vi.fn();
    render(
      <IconButton onClick={onClick} disabled focusableWhenDisabled aria-label="Close">
        <Icon />
      </IconButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards additional HTML attributes', () => {
    render(
      <IconButton data-testid="icon-btn" aria-label="Close">
        <Icon />
      </IconButton>,
    );
    expect(screen.getByTestId('icon-btn')).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} aria-label="Close">
        <Icon />
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(
        <IconButton aria-label="Close">
          <Icon />
        </IconButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(
        <IconButton disabled aria-label="Close">
          <Icon />
        </IconButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when loading', async () => {
      const { container } = render(
        <IconButton loading aria-label="Saving">
          <Icon />
        </IconButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when focusableWhenDisabled', async () => {
      const { container } = render(
        <IconButton disabled focusableWhenDisabled aria-label="Close">
          <Icon />
        </IconButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
