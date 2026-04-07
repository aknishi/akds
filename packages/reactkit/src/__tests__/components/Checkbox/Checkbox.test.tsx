import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from '../../../components/Checkbox/Checkbox';

expect.extend(toHaveNoViolations);

describe('Checkbox', () => {
  it('renders with correct role and accessible name', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Checkbox label="Test" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('akds-checkbox');
    expect(label).toHaveClass('akds-checkbox--md');
  });

  it('applies size modifier classes', () => {
    const { rerender, container } = render(<Checkbox size="sm" />);
    expect(container.querySelector('label')).toHaveClass('akds-checkbox--sm');

    rerender(<Checkbox size="lg" />);
    expect(container.querySelector('label')).toHaveClass('akds-checkbox--lg');
  });

  it('applies disabled modifier class', () => {
    const { container } = render(<Checkbox disabled label="Disabled" />);
    expect(container.querySelector('label')).toHaveClass('akds-checkbox--disabled');
  });

  it('disables the underlying input when disabled', () => {
    render(<Checkbox disabled label="Disabled" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} label="Click me" />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<Checkbox disabled onChange={onChange} label="Disabled" />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects the checked prop (controlled)', () => {
    const { rerender } = render(<Checkbox checked={false} onChange={() => {}} label="Controlled" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(<Checkbox checked={true} onChange={() => {}} label="Controlled" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('respects the defaultChecked prop (uncontrolled)', () => {
    render(<Checkbox defaultChecked label="Unchecked" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('forwards HTML attributes to the label', () => {
    const { container } = render(<Checkbox data-testid="my-checkbox" label="Test" />);
    expect(container.querySelector('label')).toHaveAttribute('data-testid', 'my-checkbox');
  });

  it('forwards name and value to the input', () => {
    render(<Checkbox name="opt" value="a" label="A" />);
    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('name', 'opt');
    expect(input).toHaveAttribute('value', 'a');
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Checkbox label="Accept terms" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when checked', async () => {
      const { container } = render(<Checkbox checked onChange={() => {}} label="Checked" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Checkbox disabled label="Disabled" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations without a label when aria-label is provided', async () => {
      const { container } = render(<Checkbox aria-label="Accept terms" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
