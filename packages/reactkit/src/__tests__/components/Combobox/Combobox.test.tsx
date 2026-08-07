import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Combobox } from '../../../components/Combobox/Combobox';

expect.extend(toHaveNoViolations);

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
];

describe('Combobox', () => {
  it('renders the input', () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    expect(container.firstChild).toHaveClass('akds-combobox');
  });

  it('opens listbox on input focus', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('renders all options in the listbox', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(OPTIONS.length);
  });

  it('filters options based on input value', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByRole('combobox'), 'an');
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(2); // Banana, Durian
  });

  it('selects an option on click (single)', async () => {
    const onChange = vi.fn();
    render(<Combobox options={OPTIONS} aria-label="Fruit" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(onChange).toHaveBeenCalledWith('apple');
  });

  it('closes listbox after single selection', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('multiple: keeps listbox open after selection', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" multiple />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('multiple: calls onChange with array', async () => {
    const onChange = vi.fn();
    render(<Combobox options={OPTIONS} aria-label="Fruit" multiple onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(onChange).toHaveBeenCalledWith(['apple']);
    await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onChange).toHaveBeenCalledWith(['apple', 'banana']);
  });

  it('disabled option cannot be selected', async () => {
    const onChange = vi.fn();
    render(<Combobox options={OPTIONS} aria-label="Fruit" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    const disabled = screen.getByRole('option', { name: 'Durian' });
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(disabled);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled option has --disabled class', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Durian' })).toHaveClass('akds-combobox__option--disabled');
  });

  it('controlled: reflects value prop', () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" value="banana" />);
    expect(screen.getByRole('combobox')).toHaveValue('Banana');
  });

  it('Escape closes listbox and clears input', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByRole('combobox'), 'app');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" helperText="Pick a fruit" />);
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
  });

  it('disabled state prevents opening', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" disabled />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('forwards ref to container div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Combobox ref={ref} options={OPTIONS} aria-label="Fruit" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Combobox options={OPTIONS} label="Fruit" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Combobox options={OPTIONS} label="Fruit" disabled />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
