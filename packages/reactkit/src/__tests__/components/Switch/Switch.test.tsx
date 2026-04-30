import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Switch } from '../../../components/Switch/Switch';

expect.extend(toHaveNoViolations);

describe('Switch', () => {
  it('renders a checkbox with role switch and accessible label', () => {
    render(<Switch label="Enable notifications" />);
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
  });

  it('applies base and default modifier classes to the label', () => {
    const { container } = render(<Switch label="Test" />);
    const label = container.firstChild as HTMLElement;
    expect(label).toHaveClass('akds-switch', 'akds-switch--md');
  });

  it('applies size modifier classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const { rerender, container } = render(<Switch label="Test" size="sm" />);
    sizes.forEach(size => {
      rerender(<Switch label="Test" size={size} />);
      expect(container.firstChild).toHaveClass(`akds-switch--${size}`);
    });
  });

  it('applies disabled class and sets disabled on the input', () => {
    const { container } = render(<Switch label="Test" disabled />);
    expect(container.firstChild).toHaveClass('akds-switch--disabled');
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('calls onChange when toggled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch label="Test" onChange={handleChange} />);
    await user.click(screen.getByText('Test'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch label="Test" disabled onChange={handleChange} />);
    await user.click(screen.getByText('Test'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders in checked state with defaultChecked', () => {
    render(<Switch label="Test" defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('supports controlled checked prop', () => {
    const { rerender } = render(<Switch label="Test" checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).not.toBeChecked();
    rerender(<Switch label="Test" checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('forwards data-* attributes via rest spread', () => {
    render(<Switch label="Test" data-testid="my-switch" />);
    expect(screen.getByTestId('my-switch')).toBeInTheDocument();
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Switch label="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders without a label when label prop is omitted', () => {
    const { container } = render(<Switch aria-label="Toggle" />);
    expect(container.querySelector('.akds-switch__label')).not.toBeInTheDocument();
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Switch label="Enable" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when checked', async () => {
      const { container } = render(<Switch label="Enable" defaultChecked />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Switch label="Enable" disabled />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
