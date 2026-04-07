import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Radio } from '../../../components/Radio/Radio';

expect.extend(toHaveNoViolations);

describe('Radio', () => {
  it('renders with correct role and accessible name', () => {
    render(<Radio label="Option A" name="group" />);
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Radio label="A" name="g" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('akds-radio');
    expect(label).toHaveClass('akds-radio--md');
  });

  it('applies size modifier classes', () => {
    const { rerender, container } = render(<Radio size="sm" name="g" />);
    expect(container.querySelector('label')).toHaveClass('akds-radio--sm');

    rerender(<Radio size="lg" name="g" />);
    expect(container.querySelector('label')).toHaveClass('akds-radio--lg');
  });

  it('applies disabled modifier class', () => {
    const { container } = render(<Radio disabled label="D" name="g" />);
    expect(container.querySelector('label')).toHaveClass('akds-radio--disabled');
  });

  it('disables the underlying input when disabled', () => {
    render(<Radio disabled label="D" name="g" />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<Radio onChange={onChange} label="Click" name="g" />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<Radio disabled onChange={onChange} label="D" name="g" />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards name and value to the input', () => {
    render(<Radio name="colors" value="red" label="Red" />);
    const input = screen.getByRole('radio');
    expect(input).toHaveAttribute('name', 'colors');
    expect(input).toHaveAttribute('value', 'red');
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio ref={ref} label="Ref" name="g" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Radio label="Option A" name="group" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when checked', async () => {
      const { container } = render(
        <Radio checked onChange={() => {}} label="Option A" name="group" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Radio disabled label="Option A" name="group" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
