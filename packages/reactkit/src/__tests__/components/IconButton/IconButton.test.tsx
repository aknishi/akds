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
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
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

  describe('as a link (href)', () => {
    it('renders a link with the button classes', () => {
      render(
        <IconButton href="/orders/1" aria-label="Go to order 1">
          <Icon />
        </IconButton>,
      );
      const link = screen.getByRole('link', { name: 'Go to order 1' });
      expect(link).toHaveAttribute('href', '/orders/1');
      expect(link).toHaveClass('akds-icon-button', 'akds-icon-button--solid', 'akds-icon-button--neutral');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('applies appearance and emphasis classes', () => {
      render(
        <IconButton href="/" appearance="bordered" emphasis="accented" aria-label="Home">
          <Icon />
        </IconButton>,
      );
      expect(screen.getByRole('link')).toHaveClass('akds-icon-button--bordered', 'akds-icon-button--accented');
    });

    it('defaults rel to noopener noreferrer for a new tab', () => {
      render(
        <IconButton href="/orders/1" target="_blank" aria-label="Open order 1 in a new tab">
          <Icon />
        </IconButton>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('keeps a rel that is passed in', () => {
      render(
        <IconButton href="/orders/1" target="_blank" rel="noopener" aria-label="Open order 1 in a new tab">
          <Icon />
        </IconButton>,
      );
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener');
    });

    it('sets no rel for the same tab', () => {
      render(
        <IconButton href="/orders/1" aria-label="Go to order 1">
          <Icon />
        </IconButton>,
      );
      expect(screen.getByRole('link')).not.toHaveAttribute('rel');
    });

    it('calls onClick', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
      render(
        <IconButton href="#order-1" aria-label="Go to order 1" onClick={onClick}>
          <Icon />
        </IconButton>,
      );
      await user.click(screen.getByRole('link'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('forwards the ref to the anchor element', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(
        <IconButton ref={ref} href="/" aria-label="Home">
          <Icon />
        </IconButton>,
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it('has no axe violations', async () => {
      const { container } = render(
        <IconButton href="/orders/1" target="_blank" aria-label="Open order 1 in a new tab">
          <Icon />
        </IconButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
