import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LikeButton } from '../../../components/LikeButton/LikeButton';

expect.extend(toHaveNoViolations);

function mockPrefersReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  // @ts-expect-error jsdom does not implement matchMedia by default
  delete window.matchMedia;
});

describe('LikeButton', () => {
  it('renders with the accessible name from aria-label', () => {
    render(<LikeButton aria-label="Like">Like</LikeButton>);
    expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<LikeButton aria-label="Like">Like</LikeButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('akds-like-button');
    expect(btn).not.toHaveClass('akds-like-button--disabled');
  });

  it('applies disabled class and attribute', () => {
    render(<LikeButton disabled aria-label="Like">Like</LikeButton>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('akds-like-button--disabled');
  });

  it('remains focusable and blocks clicks when focusableWhenDisabled', async () => {
    const onClick = vi.fn();
    render(
      <LikeButton disabled focusableWhenDisabled onClick={onClick} aria-label="Like">
        Like
      </LikeButton>,
    );
    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is unliked by default and shows the outline icon', () => {
    const { container } = render(<LikeButton aria-label="Like">Like</LikeButton>);
    expect(container.querySelector('svg')).not.toHaveClass('akds-icon--error');
  });

  it('toggles the icon and calls onClick on click (uncontrolled)', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <LikeButton onClick={onClick} aria-label="Like">
        Like
      </LikeButton>,
    );
    const btn = screen.getByRole('button');

    await userEvent.click(btn);
    expect(container.querySelector('svg')).toHaveClass('akds-icon--error');
    expect(onClick).toHaveBeenCalledTimes(1);

    await userEvent.click(btn);
    expect(container.querySelector('svg')).not.toHaveClass('akds-icon--error');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<LikeButton disabled onClick={onClick} aria-label="Like">Like</LikeButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('respects the controlled liked prop', () => {
    const { container, rerender } = render(<LikeButton liked={false} aria-label="Like">Like</LikeButton>);
    expect(container.querySelector('svg')).not.toHaveClass('akds-icon--error');

    rerender(<LikeButton liked aria-label="Like">Like</LikeButton>);
    expect(container.querySelector('svg')).toHaveClass('akds-icon--error');
  });

  it('spawns a particle burst when liked but not when unliked', async () => {
    const { container } = render(<LikeButton aria-label="Like">Like</LikeButton>);
    const btn = screen.getByRole('button');
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(0);

    await userEvent.click(btn);
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(1);

    await userEvent.click(btn);
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(1);
  });

  it('does not spawn a particle burst when prefers-reduced-motion is enabled', async () => {
    mockPrefersReducedMotion(true);
    const { container } = render(<LikeButton aria-label="Like">Like</LikeButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(container.querySelector('.akds-particle-burst__burst')).not.toBeInTheDocument();
  });

  it('forwards additional HTML attributes', () => {
    render(<LikeButton data-testid="like-btn" aria-label="Like">Like</LikeButton>);
    expect(screen.getByTestId('like-btn')).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<LikeButton ref={ref} aria-label="Like">Like</LikeButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<LikeButton aria-label="Like">Like</LikeButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when liked', async () => {
      const { container } = render(<LikeButton liked aria-label="Unlike">Like</LikeButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<LikeButton disabled aria-label="Like">Like</LikeButton>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when focusableWhenDisabled', async () => {
      const { container } = render(
        <LikeButton disabled focusableWhenDisabled aria-label="Like">
          Like
        </LikeButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
