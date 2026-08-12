import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

const OVERLAPPING_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'pineapple', label: 'Pineapple' },
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

  it('passes through arbitrary HTML attributes to the root element', () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" data-testid="fruit-combobox" />);
    expect(screen.getByTestId('fruit-combobox')).toBeInTheDocument();
  });

  it('applies the full-width modifier class', () => {
    const { container } = render(<Combobox options={OPTIONS} aria-label="Fruit" fullWidth />);
    expect(container.firstChild).toHaveClass('akds-combobox--full-width');
  });

  it('uses aria-labelledby when a label is provided', () => {
    render(<Combobox options={OPTIONS} label="Fruit" />);
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeInTheDocument();
  });

  it('applies placeholder text only when no label is set', () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" placeholder="Choose one" />);
    expect(screen.getByPlaceholderText('Choose one')).toBeInTheDocument();
  });

  it('shows "No results" when the filter matches nothing', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('marks the selected option with aria-selected', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" value="banana" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
  });

  it('sets aria-multiselectable on the listbox in multiple mode', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" multiple />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('uncontrolled: renders defaultValue selection', () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" defaultValue="cherry" />);
    expect(screen.getByRole('combobox')).toHaveValue('Cherry');
  });

  it('uncontrolled: renders chips for defaultValue array in multiple mode', () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" multiple defaultValue={['apple', 'banana']} />);
    expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Banana' })).toBeInTheDocument();
  });

  it('applies keyboard-focus modifier class when focused via keyboard', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.tab();
    expect(screen.getByRole('combobox').closest('.akds-combobox__control')).toHaveClass(
      'akds-combobox__control--keyboard-focus',
    );
  });

  it('does not apply keyboard-focus modifier class when focused via pointer', async () => {
    render(<Combobox options={OPTIONS} aria-label="Fruit" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox').closest('.akds-combobox__control')).not.toHaveClass(
      'akds-combobox__control--keyboard-focus',
    );
  });

  describe('chips (multiple mode)', () => {
    it('renders a chip for each selected value', () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" multiple value={['apple', 'banana']} />);
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove Banana' })).toBeInTheDocument();
    });

    it('removes a chip on click and refocuses the input', async () => {
      const onChange = vi.fn();
      render(
        <Combobox
          options={OPTIONS}
          aria-label="Fruit"
          multiple
          value={['apple', 'banana']}
          onChange={onChange}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Remove Apple' }));
      expect(onChange).toHaveBeenCalledWith(['banana']);
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('clicking a selected option again deselects it', async () => {
      const onChange = vi.fn();
      render(
        <Combobox options={OPTIONS} aria-label="Fruit" multiple value={['apple']} onChange={onChange} />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      // Focusing an already-populated combobox does not auto-open the listbox;
      // ArrowDown opens it and focuses the first option regardless of selection.
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('Backspace with empty input removes the last selected chip', async () => {
      const onChange = vi.fn();
      render(
        <Combobox
          options={OPTIONS}
          aria-label="Fruit"
          multiple
          value={['apple', 'banana']}
          onChange={onChange}
        />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{Backspace}');
      expect(onChange).toHaveBeenCalledWith(['apple']);
    });

    it('Backspace with non-empty input does not remove a chip', async () => {
      const onChange = vi.fn();
      render(
        <Combobox
          options={OPTIONS}
          aria-label="Fruit"
          multiple
          value={['apple']}
          onChange={onChange}
        />,
      );
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByRole('combobox'), 'ban');
      await userEvent.keyboard('{Backspace}');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowDown from the input focuses the first option', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();
    });

    it('ArrowDown within the listbox moves focus to the next option and wraps', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveFocus();
    });

    it('ArrowUp within the listbox moves focus to the previous option', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();
    });

    it('ArrowUp on the first option returns focus to the input', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('Home focuses the first option', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      await userEvent.keyboard('{Home}');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();
    });

    it('End focuses the last enabled option', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{End}');
      expect(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus();
    });

    it('Escape within the listbox closes it and refocuses the input', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('Tab within the listbox closes it', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Tab}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Enter key selection', () => {
    it('selects the sole filtered option', async () => {
      const onChange = vi.fn();
      render(<Combobox options={OPTIONS} aria-label="Fruit" onChange={onChange} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByRole('combobox'), 'cherr');
      await userEvent.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledWith('cherry');
    });

    it('prefers an exact label match over multiple filtered candidates', async () => {
      const onChange = vi.fn();
      render(<Combobox options={OVERLAPPING_OPTIONS} aria-label="Fruit" onChange={onChange} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByRole('combobox'), 'Apple');
      expect(screen.getAllByRole('option')).toHaveLength(2);
      await userEvent.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('reopens a closed listbox instead of selecting when there is no match', async () => {
      render(<Combobox options={OPTIONS} aria-label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('blur behaviour', () => {
    it('commits an exact typed match on blur', () => {
      const onChange = vi.fn();
      render(<Combobox options={OPTIONS} aria-label="Fruit" onChange={onChange} />);
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Banana' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('clears the input without selecting when there is no match on blur', () => {
      const onChange = vi.fn();
      render(<Combobox options={OPTIONS} aria-label="Fruit" onChange={onChange} />);
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'zzz' } });
      fireEvent.blur(input);
      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  it('closes the listbox on outside click', async () => {
    render(
      <div>
        <Combobox options={OPTIONS} aria-label="Fruit" />
        <button type="button">Outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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

    it('has no violations in multiple mode with chips selected', async () => {
      const { container } = render(
        <Combobox options={OPTIONS} label="Fruit" multiple value={['apple', 'banana']} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with the listbox open', async () => {
      const { container } = render(<Combobox options={OPTIONS} label="Fruit" />);
      await userEvent.click(screen.getByRole('combobox'));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
