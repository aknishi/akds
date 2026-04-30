import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Avatar } from '../../../components/Avatar/Avatar';

expect.extend(toHaveNoViolations);

describe('Avatar', () => {
  it('renders an img element when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Jane Smith" />);
    expect(screen.getByRole('img', { name: 'Jane Smith' })).toBeInTheDocument();
  });

  it('renders initials when name is provided and no src', () => {
    const { container } = render(<Avatar name="Adrian Kawanishi" />);
    expect(container.querySelector('.akds-avatar__initials')).toHaveTextContent('AK');
  });

  it('renders two-letter initials for two-word names', () => {
    const { container } = render(<Avatar name="Jane Smith" />);
    expect(container.querySelector('.akds-avatar__initials')).toHaveTextContent('JS');
  });

  it('renders three-letter initials for three-or-more word names', () => {
    const { container } = render(<Avatar name="Mary Jane Watson" />);
    expect(container.querySelector('.akds-avatar__initials')).toHaveTextContent('MJW');
  });

  it('renders single-letter initials for single-word names', () => {
    const { container } = render(<Avatar name="Madonna" />);
    expect(container.querySelector('.akds-avatar__initials')).toHaveTextContent('M');
  });

  it('src takes priority over name', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Photo" name="Jane Smith" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryByText('JS')).not.toBeInTheDocument();
  });

  it('renders provided icon when no src or name', () => {
    const { container } = render(<Avatar icon={<svg data-testid="custom-icon" />} />);
    expect(container.querySelector('.akds-avatar__icon')).toBeInTheDocument();
  });

  it('renders PersonIcon as default fallback when nothing is provided', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('.akds-avatar__icon')).toBeInTheDocument();
  });

  it('applies base and default size class', () => {
    const { container } = render(<Avatar name="AK" />);
    expect(container.firstChild).toHaveClass('akds-avatar', 'akds-avatar--md');
  });

  it('applies size modifier classes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    const { rerender, container } = render(<Avatar name="AK" size="sm" />);
    sizes.forEach(size => {
      rerender(<Avatar name="AK" size={size} />);
      expect(container.firstChild).toHaveClass(`akds-avatar--${size}`);
    });
  });

  it('applies a deterministic color class for a given name', () => {
    const { container } = render(<Avatar name="Adrian Kawanishi" />);
    const el = container.firstChild as HTMLElement;
    const colorClasses = ['blue', 'green', 'purple', 'orange', 'red'].map(c => `akds-avatar--${c}`);
    expect(colorClasses.some(c => el.classList.contains(c))).toBe(true);
  });

  it('always resolves the same color for the same name', () => {
    const { container: a } = render(<Avatar name="Jane Smith" />);
    const { container: b } = render(<Avatar name="Jane Smith" />);
    const getColor = (el: HTMLElement) =>
      ['blue', 'green', 'purple', 'orange', 'red'].find(c => el.classList.contains(`akds-avatar--${c}`));
    expect(getColor(a.firstChild as HTMLElement)).toBe(getColor(b.firstChild as HTMLElement));
  });

  it('applies the explicit color override when color prop is provided', () => {
    const { container } = render(<Avatar name="Jane Smith" color="purple" />);
    expect(container.firstChild).toHaveClass('akds-avatar--purple');
  });

  it('forwards ref to the span element', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Avatar name="AK" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('forwards data-testid via rest spread', () => {
    render(<Avatar name="AK" data-testid="my-avatar" />);
    expect(screen.getByTestId('my-avatar')).toBeInTheDocument();
  });

  describe('axe accessibility', () => {
    it('has no violations with image', async () => {
      const { container } = render(<Avatar src="https://example.com/a.jpg" alt="Jane Smith" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with initials', async () => {
      const { container } = render(<Avatar name="Jane Smith" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with default icon fallback', async () => {
      const { container } = render(<Avatar name="Unknown User" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
